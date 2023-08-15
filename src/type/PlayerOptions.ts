export interface PlayerOptions {
    url: string
    streamingPlay: boolean
    videoContainer: HTMLElement | HTMLVideoElement
    autoPlay: boolean
    
}

export type videoInfo = {
    url: string //视频的源地址
    volume: number // 视频的音量
    time: string // 视频的当前时间
    duration: number // 视频的总时长
    frameRate: number //视频的帧率 kps;
    brandRate: number //视频的码率 bps
    videoCodec: string //视频的编码方式
    audioCodec: string // 音频的编码方式
    lastUpdateTime: Date //视频最后一次更新时间
    isFragmented: boolean //是否为fragmented类型的mp4文件
    width: number //视频宽度上的分辨率（像素个数）
    height: number // 视频高度上的分辨率（像素个数）
}