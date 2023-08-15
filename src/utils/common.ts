/** 根据传入的 URL 获取 URL 指向文件的后缀, 如果有后缀返回后缀，没有则返回原本的 url */
export function getFileFormat(url: string){
    if (url.includes(".")){
        return url.split(".").pop()
    }
    return url
}
interface eventList{
    [key: string]: Array<Function>
}
export class Observer {
    list: eventList
    constructor () {
        this.list = {}
    }
    
    on(event: string, fn: Function) {      
        this.list[event] = this.list[event] || new Array<Function>
        this.list[event].push(fn)
        return this.list[event].length - 1
    }
    
    emit(event: string, params: object){
        if (!this.list[event])
            throw 'There is no such event'
        this.list[event].forEach( fn => fn(params) )
    }
    
    off(event: string, eventFn?: Function | null, eventFnId?: number){
        if (!this.list[event])
            return false
        
        let index = this.list[event].indexOf(this.list[event].find( fn => fn === eventFn ) || function(){} ) || eventFnId
        
        if (index)
            this.list[event].splice(index, 1)
    }
}