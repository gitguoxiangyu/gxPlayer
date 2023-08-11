/** 根据传入的 URL 获取 URL 指向文件的后缀, 如果有后缀返回后缀，没有则返回原本的 url */
export function getFileFormat(url: string){
    if (url.includes(".")){
        return url.split(".").pop()
    }
    return url
}