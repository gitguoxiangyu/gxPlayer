import Http from "@/request/http.js"
class MediaPlayer {
    // url: string
    mediaSource: MediaSource
    http: Http
    constructor(url: string){
        // this.url = url
        this.mediaSource = new MediaSource()
        this.http = new Http(url)
    }
    
    initEvent(){
        // 当 sourceopen 事件触发后，
        this.mediaSource.addEventListener('sourceopen',() => {
            
        })
    }
    
    getFileBuffer(){
        this.http.continuousRequest()
    }
}