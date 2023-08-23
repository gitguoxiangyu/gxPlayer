import { Player } from "@/player/player.js";
import http from "@/request/http.js";
import MP4Box, { type MP4ArrayBuffer, MP4File } from 'mp4box'

let subscriptID: number

export default class Mp4Parse {
    /** 请求器 */
    url: string
    http: http
    mp4box = MP4Box.createFile()
    player: Player
    
    constructor(url: string, player: Player){
        this.url = url
        this.http = new http(url)
        this.player = player
        // 初始化事件回调
        this.initEvent()
        // 加载视频流
        this.loadFile()
    }
    
    loadFile(){
        // 128 KB
        this.http.chunkSize = 131584
        
        // 订阅 DATA-REVIEW ，当收到视频数据时，将二进制数据交给 mp4box 解析
        subscriptID = this.http.subscript.on('DATA-REVIEW',(data: MP4ArrayBuffer)=>{
            data.fileStart = this.http.chunkStart
            this.http.chunkStart = this.mp4box.appendBuffer(data)
        })
        this.http.isActive = true
        this.http.continuousRequest()
    }
    
    
    initEvent(){
        // 当 mp4 moov box 解析完成时触发该事件回调
        // 解析完成后，停止请求，将视频信息赋给 player.videoInfo
        this.mp4box.onReady = (mp4Info) => {
            console.log("mp4 moov box 解析完成")
            console.log(mp4Info);
            // 停止连续请求
            this.stop()
            // 取消订阅
            this.http.subscript.off('DATA-REVIEW', null, subscriptID)
            
            this.player.videoInfo = {
                url: this.url,
                lastUpdateTime: mp4Info.modified,
                videoCodec: mp4Info.tracks[0].codec,
                audioCodec: mp4Info.tracks[1].codec,
                isFragmented: mp4Info.isFragmented,
                width: mp4Info.tracks[0].track_width,
                height: mp4Info.tracks[0].track_height,
            }
        }
    }
    
    stop(){
        this.http.stop()
    }
}