import http from "@/request/http.js";
import MP4Box, { MP4ArrayBuffer, MP4File } from 'mp4box'
export default class Mp4Parse {
    /** 请求器 */
    http: http
    mp4box = MP4Box.createFile()
    
    constructor(url: string){
        this.http = new http(url)
    }
    
    loadFile(){
        // 128 KB
        this.http.chunkSize = 131584
        this.http.request((value: Response) => {
            
        })
    }
}