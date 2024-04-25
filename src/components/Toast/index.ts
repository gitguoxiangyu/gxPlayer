import { classNamePrefix } from "@/constants/index.js"
import { Player } from "@/player/player.js"

export class Toast{
    readonly name = 'Toast'
    readonly player: Player
    dom?: HTMLElement

    constructor(player: Player, dom?: HTMLElement){
        // super()
        this.player = player
        this.dom = dom
    }

    initTemplate(){
        if (this.dom){
            this.dom.classList.add(classNamePrefix + 'video-toast')
        }
    }
}