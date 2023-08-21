declare module 'mp4box' {
    interface MP4MediaTrack {
        id: number
        created: Date
        modified: Date
        movie_duration: number
        layer: number
        alternate_group: number
        volume: number
        track_width: number
        track_height: number
        /** 轨道时间刻度 */
        timescale: number
        /** 轨道（未碎片部分）的持续时间，以时间刻度为单位 */
        duration: number
        /** 以每秒比特为单位提供轨道的比特率 */
        bitrate: number
        /** 为此轨道提供 MIME 编解码器参数（例如“avc1.42c00d”或“mp4a.40.2” */
        codec: string
        language: string
        /** 轨道样本（即帧）的数量 */
        nb_samples: number
    }

    interface MP4VideoData {
        width: number
        height: number
    }

    interface MP4VideoTrack extends MP4MediaTrack {
        video: MP4VideoData
    }

    interface MP4AudioData {
        sample_rate: number
        channel_count: number
        sample_size: number
    }

    interface MP4AudioTrack extends MP4MediaTrack {
        audio: MP4AudioData
    }

    export type MP4Track = MP4VideoTrack | MP4AudioTrack

    export interface MP4Info {
        duration: number
        timescale: number
        fragment_duration: number
        isFragmented: boolean
        isProgressive: boolean
        hasIOD: boolean
        brands: string[]
        created: Date
        modified: Date
        tracks: MP4Track[]
    }

    interface LogInterface {
        debug: (module: string, msg: string) => void
        log: (module: string, msg: string) => void
        info: (module: string, msg: string) => void
        warn: (module: string, msg: string) => void
        error: (module: string, msg: any) => void
        [props: string]: any
    }

    export type MP4ArrayBuffer = ArrayBuffer & { fileStart: number }

    export type MP4MediaSource = MediaSource & {
        sb?: MP4SourceBuffer
        pendingInits?: number
    }
    export type MP4SourceBuffer = SourceBuffer & {
        /** 该 SourceBuffer 绑定的 MediaSource */
        ms: MP4MediaSource
        id?: number
        segmentIndex?: number
        pendingAppends?: any[]
        sampleNum?: number
        is_last?: boolean
    }

    export interface MP4File {
        onMoovStart?: () => void
        onReady?: (info: MP4Info) => void
        onError?: (e: string) => void
        onSegment?: (
            id: number,
            user: MP4SourceBuffer,
            buffer: MP4ArrayBuffer,
            sampleNum: number,
            is_last: boolean
        ) => void
        onItem?: (item: any) => void
        appendBuffer(data: MP4ArrayBuffer, end?: boolean): number
        setSegmentOptions(
            id: number,
            sb: SourceBuffer,
            options?: { [props: string]: any }
        ): void
        initializeSegmentation(): {
            id: number
            user: MP4SourceBuffer
            buffer?: ArrayBuffer
        }[]
        releaseUsedSamples(id: number, samples: number): void
        start(): void
        stop(): void
        flush(): void
        seek(time: number, b: boolean): { offset: number; [props: string]: any }
    }

    export const Log: LogInterface

    export function createFile(): MP4File

    export {}
}
