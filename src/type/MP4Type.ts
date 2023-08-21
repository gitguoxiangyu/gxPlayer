import { MP4Info } from "mp4box"

export type MoovBoxInfo = Omit<Partial<MP4Info>, 'brand'>

export type MediaTrack = {
    id: number
    created?: Date
    modified?: Date
    volume?: number
    track_width?: number
    track_height?: number
    timescale?: number
    duration?: number
    bitrate?: number
    codec?: string
    language?: string
    [props: string]: any
}