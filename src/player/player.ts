import { PlayerOptions } from "@/type/PlayerOptions.js";
import { getFileFormat } from "@/utils/common.js";

class Player {
    readonly playerOptions: Partial<PlayerOptions>;
    video: HTMLVideoElement;
    
    constructor (options: Partial<PlayerOptions>){
        this.playerOptions = Object.assign(
            {
                autoPlay: false,
                streamPlay: false,
            },
            options
        )
        
        // 判断是否输入了 video 元素
        if (options.videoContainer && options.videoContainer instanceof HTMLVideoElement){
            this.video = options.videoContainer
        }else{
            this.video = document.createElement('video')
        }
    }
    
    init(){
        
    }
    
    /** 给video添加媒体资源，开始初始化媒体资源的解析 */
    attachSource(url: string){
        let fileFormat = getFileFormat(url)
        if (fileFormat === 'mp4'){
            
        }else{
            console.log("url 不合法")
        }
    }
}