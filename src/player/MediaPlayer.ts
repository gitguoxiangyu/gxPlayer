import Http from "@/request/http.js"
import { MoovBoxInfo } from "@/type/MP4Type.js"
import MP4Box, { type MP4ArrayBuffer, MP4File, MP4Track, MP4SourceBuffer } from 'mp4box'
import { Player } from "./player.js"

let subscriptID: number

class MediaPlayer {
    player: Player
    mediaSource: MediaSource
    http: Http
    url: string
    mp4box: MP4File
    mediaMoovInfo: MoovBoxInfo = {}
    
    constructor(url: string , player: Player){
        this.url = url
        this.mediaSource = new MediaSource()
        this.http = new Http(url)
        this.mp4box = MP4Box.createFile()
        this.player = player
        this.player.video.src = window.URL.createObjectURL(this.mediaSource)
    }
    
    initEvent(){
        // 当 sourceopen 事件触发后，开始加载视频数据
        this.mediaSource.addEventListener('sourceopen',() => {
            this.getFileBuffer()
        })
        
        // 开始解析moov box时触发该事件
        this.mp4box.onMoovStart = function () {
            console.log('开始解析视频信息')
        }
        
        // 解析moov box完成时触发该事件
        this.mp4box.onReady = (info) => {
            console.log('解析视频信息完成')
            this.mediaMoovInfo = info
            if (info.isFragmented) {
                this.mediaSource.duration = info.fragment_duration / info.timescale
            } else {
                this.mediaSource.duration = info.duration / info.timescale
            }
            // 停止连续请求
            this.http.stop()
            
            // 为所有视频轨道创建 sourceBuffer
            for (var i = 0; i < this.mediaMoovInfo.tracks!.length; i++) {
                var track = info.tracks[i]
                this.addBuffer(track)
            }
            
            
            // mp4boxfile.initializeSegmentation 指示应用程序已准备好接收段, 返回 {id , arraybuffer, SourceBuffer}
            // 注意：这里获取到的 ArrayBuffer 是初始化段数据，而不是媒体数据
            let initSegments = this.mp4box.initializeSegmentation()
            for (let i = 0; i < initSegments.length; i++){
                let segmentSourceBuffer = initSegments[i].user
                if (i === 0) {
                    segmentSourceBuffer.ms.pendingInits = 0
                }
                // 将初始化段 buffer 加进 SourceBuffer 内
                segmentSourceBuffer.appendBuffer(initSegments[i].buffer!)
                segmentSourceBuffer.segmentIndex = 0
                // pendingInits 是 MediaSource 身上的属性，所以在 i=0 时，已经初始化 pendingInits，pendingInits 必然存在
                segmentSourceBuffer.ms.pendingInits!++
                // 当 appendBuffer 执行完毕后，调用回调
                segmentSourceBuffer.onupdate = this.initAppend
            }
        }
        
        this.mp4box.onSegment = (id, user, buffer, sampleNum, is_last) => {
            let mp4SourceBuffer = user
            mp4SourceBuffer.segmentIndex!++
            mp4SourceBuffer.pendingAppends?.push(buffer)
        }
    }
    
    initAppend(e: Event){
        let sourceBuffer = e.target as MP4SourceBuffer
        
        if (sourceBuffer.ms.readyState === 'open'){
            sourceBuffer.sampleNum = 0
            sourceBuffer.onupdate = null
            sourceBuffer.addEventListener('update', this.updateAppend.bind(sourceBuffer, true, this))
            this.updateAppend.call(sourceBuffer, true, this)
            // 当缓存区清空时，继续请求
            sourceBuffer.ms.pendingInits!--
            if (sourceBuffer.ms.pendingInits! === 0) {
                // 重新开始继续请求
                this.start()
            }
        }
    }
    
    updateAppend(isEndOfAppend: boolean, meidaPlayer: MediaPlayer){
        let that = this as unknown as MP4SourceBuffer
        if (isEndOfAppend){
            // 移除使用过的帧
            if (that.sampleNum){
                meidaPlayer.mp4box.releaseUsedSamples(that.id!, that.sampleNum)
                delete that.sampleNum
            }
            if (that.is_last)
                that.ms.endOfStream()
        }
        
        if (that.ms.readyState === 'open' && that.updating === false && that.pendingAppends?.length){
            let append = that.pendingAppends.shift()
            that.sampleNum = append.sampleNum
            that.is_last = append.is_last
            // 推入视频数据流
            that.appendBuffer(append.buffer)
        }
    }
    
    getFileBuffer(){
        // 128 KB
        this.http.chunkSize = 131584
        
        if (subscriptID === undefined)
            // 订阅 DATA-REVIEW ，当收到视频数据时，将二进制数据交给 mp4box 解析
            subscriptID = this.http.subscript.on('DATA-REVIEW',(data: MP4ArrayBuffer)=>{
                data.fileStart = this.http.chunkStart
                let nextStart = this.mp4box.appendBuffer(data,this.http.eof)
                
                if (this.http.eof)
                    this.mp4box.flush()
                else
                    this.http.chunkStart = nextStart
            })
        this.http.continuousRequest()
    }
    
    /** 根据传入的媒体轨道的类型创建对应的SourceBuffer，一一对应 */
    addBuffer(track: MP4Track) {
        let mime = `video/mp4; codecs="${track.codec}"`
        
        if (MediaSource.isTypeSupported(mime)){
            let mp4SourceBuffer: MP4SourceBuffer = this.mediaSource.addSourceBuffer(mime) as MP4SourceBuffer
            mp4SourceBuffer.ms = this.mediaSource
            mp4SourceBuffer.id = track.id
            
            // 开始分段，将对应分段的 buffer 切割出来，分段完成后，使用 onSegement 回调获取
            this.mp4box.setSegmentOptions(track.id, mp4SourceBuffer)
        }else {
            console.log(`不支持${mime}格式的视频`)
            throw 'Video in this format is not supported'
        }
    }
    
    start(){
        this.http.chunkSize = this.mp4box.seek(0,true).offset
        this.mp4box.start()
        this.getFileBuffer()
    }
    
}