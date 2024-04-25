export interface PlayerOptions {
    url: string
    streamingPlay: boolean
    videoContainer: HTMLElement | HTMLVideoElement
    autoPlay: boolean
}

export type videoInfo = {
    /** 视频的源地址 */
    url: string
    /** 视频的音量 */
    volume: number
    /** 视频的当前时间 */
    time: string
    /** 视频的总时长 */
    duration: number
    /** 视频的帧率 kps; */
    frameRate: number
    /** 视频的码率 bps */
    brandRate: number
    /** 视频的编码方式 */
    videoCodec: string
    /** 音频的编码方式 */
    audioCodec: string
    /** 视频最后一次更新时间 */
    lastUpdateTime: Date
    /** 是否为fragmented类型的mp4文件 */
    isFragmented: boolean 
    /** 视频宽度上的分辨率（像素个数） */
    width: number
    /** 视频高度上的分辨率（像素个数） */
    height: number
}