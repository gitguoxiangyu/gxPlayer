import { Observer } from "@/utils/common.js"

export default class Http {
    /** 下载器是否激活，激活则连续下载片段   */
    isActive: boolean = false
    realtime: boolean = false
    /** 请求的 chunk 在整个文件中的初始偏移量 */
    chunkStart: number = 0
    /** 请求的 chunk 大小，单位为 bytes */
    chunkSize: number = 1024
    totalLength: number = 0
    chunkTimeout: number = 500
    timeoutID: number | null = null
    url: string = ''
    eof: boolean = false
    subscript: Observer = new Observer()
    
    constructor(url?: string) {
        this.url = url || ''
        console.log(url);
    }
    
    /** 请求方法 */
    async request(success?: Function, fail?: Function){
        let res = await fetch(this.url, {
            method: "GET",
            headers: {
                "Range": this.getRequestRange(),
            }
        })
        // 取总长度
        if (res.headers.has('Content-Range')){
            this.totalLength = parseInt(res.headers.get('Content-Range')!.split('/')[1])
        }
        
        // 判断视频流是否请求完毕，如果请求视频流末端，大概率 Content-Length 不等于 请求长度
        this.eof = parseInt(res.headers.get('Content-Length') || '0') !== this.chunkSize
        
        // 将获取的二进制数据转为 arrayBuffer
        return res.arrayBuffer()
    }
    
    async continuousRequest(){
        let data = await this.request()
        this.subscript.emit('DATA-REVIEW', data)
        
        this.chunkStart += data.byteLength
        // 连续请求
        if (this.isActive === true && this.eof === false) {
            this.timeoutID = window.setTimeout(
                this.continuousRequest.bind(this),
                this.chunkTimeout
            )
        }
    }
    
    stop(){
        this.isActive = false
    }
    
    reset() {
        this.chunkStart = 0
        this.totalLength = 0
        this.eof = false
        return this
    }
    
    /** 计算返回请求视频流文件的范围 */
    getRequestRange() {
        return `bytes=${this.chunkStart}-${this.chunkStart+this.chunkSize}`
    }
}