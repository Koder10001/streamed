import APIHandler from "./APIHandler.js";
import Popup from "./Popup.js";

class Screen{
    
    #rowDOMs = [];
    #screenDOMs = [];
    #container;
    #Popup;

    constructor(){

        this.#container = document.getElementById("screen");
        this.#Popup = new Popup(this.#screenDOMs.length)
        this.#Popup.init();

    }

    async newScreen(sourceObj, screenNo){ // always have 1 screened up already
        
        let isHD = false;

        if(this.#screenDOMs.length == 0){
            isHD = true;
        }

        if (this.#screenDOMs.length <= screenNo){

            this.#screenDOMs.push(document.createElement("iframe"));
            this.#screenDOMs[screenNo].classList.add("embed");
            // this.#screenDOMs[screenNo].setAttribute("allowfullscreen", true);
            this.#screenDOMs[screenNo].setAttribute("frameborder", 0);

        }


        let embed = await this.#getEmbed(sourceObj, isHD);
        
        console.log(embed);

        this.#screenDOMs[screenNo].src = embed.embedUrl;


        if(this.#screenDOMs.length % 2 != 0 || 
        screen.width < screen.height){ // length >= 1
            
            
            
            let row = document.createElement("div");
            row.classList.add("row");
            row.append(this.#screenDOMs[screenNo]);

            
            this.#container.append(row)
            // create new row div and add embed to row
            

        }
        else {



            // append embed to row div

        }


    }

    async #getEmbed(sourceObj, isHD = false){
        let api = new APIHandler();

        //get all available server
        let servers = [];

        for(let source of sourceObj){
            servers = servers.concat(await api.getStreams(source.source,source.id));
        }

        let embed = servers[0];

        for(let url of servers){

            if(url.hd == isHD && url.viewers < embed.viewers){

                embed = structuredClone(url);

            }

        }
        return embed;

    }
    

}

export default Screen;