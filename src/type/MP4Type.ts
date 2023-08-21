import { MP4Info } from "mp4box"

export type MoovBoxInfo = Omit<Partial<MP4Info>, 'brand'>

export type MediaTrack = {
    id: number
    created?: Date
    modified?: Date
    volume?: number
    track_width?: number
    track_height?: number
    /** 轨道时间刻度 */
    timescale?: number
    /** 轨道（未碎片部分）的持续时间，以时间刻度为单位 */
    duration?: number
    /** 以每秒比特为单位提供轨道的比特率 */
    bitrate?: number
    /** 为此轨道提供 MIME 编解码器参数（例如“avc1.42c00d”或“mp4a.40.2” */
    codec?: string
    language?: string
    [props: string]: any
}