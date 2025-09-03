import APIHandler from "./APIHandler.js";
import Popup from "./Popup.js";

class Screen{
    
    #container;
    #Popup;

    constructor(){

        let screenDOMs = document.querySelectorAll(".embed");
        this.#container = document.getElementById("screen");
        this.#Popup = new Popup(screenDOMs.length)
        this.#Popup.init();
        this.#Popup.show();


    }

    get length(){
        let screenDOMs = document.querySelectorAll(".embed");
        return screenDOMs.length;
    }

    async newScreen(sourceObj){ // always have 1 screened up already
        
        let screenDOMs = document.querySelectorAll(".embed");
        

        let isHD = false;

        if(screenDOMs.length == 0){
            isHD = true;
        }

        

        let embed = await this.#getEmbed(sourceObj, isHD);
        
        let iframe = document.createElement("iframe");
        iframe.classList.add("embed");
        iframe.setAttribute("frameborder", 0);
        iframe.setAttribute("tabindex",-1);
        iframe.setAttribute("onfocus", "iframeFocused()");
        iframe.setAttribute("onmouseover","mouseOver(this)");
        iframe.setAttribute("ondblclick", "editScreen(this)")
        iframe.src = embed.embedUrl;


        this.findBestPlace(iframe);

    }

    reArrange(){
        let rows = document.querySelectorAll(".row");
        let embeds = document.querySelectorAll(".embed");
        for(let row of rows ){
            row.remove();
        }

        for(let embed of embeds){
            this.findBestPlace(embed);
        }   

    }

    findBestPlace(iframe){

        let rowDOMs = document.querySelectorAll(".row")

        if(rowDOMs.length == 0){
            let row = document.createElement("div");
            row.classList.add("row");
            row.setAttribute("tabindex", -1);
            this.#container.appendChild(row);
            rowDOMs = document.querySelectorAll(".row");

        }

        let lastRow = rowDOMs[0];

        let isEqualRows = true;

        for(let row of rowDOMs){
            if( lastRow.children.length > row.children.length ){
                lastRow = row;
                isEqualRows = false;
            }
        }

        if(!isEqualRows){
            lastRow.appendChild(iframe);
            return; 
        }
        else {

            let width = document.body.clientWidth;
            let height = document.body.clientHeight;
            let rows = document.querySelectorAll(".row").length;
            let columns = document.querySelectorAll(".embed").length / rows;

            let newScreenWidth = ( width / ( columns + 1 ) ) ;
            let newScreenHeight =  ( height / ( rows + 1 ) );
            
            let newAreaBasedOnWidth =  newScreenWidth * newScreenWidth * 9/16;
            let newAreaBasedOnHeight = newScreenHeight * newScreenHeight * 16/9;

            console.log(newAreaBasedOnHeight, newAreaBasedOnWidth)

            if(newAreaBasedOnWidth >= newAreaBasedOnHeight){
                rowDOMs[0].appendChild(iframe);
            }
            else {
                let row = document.createElement("div");
                row.classList.add("row");
                row.setAttribute("tabindex", -1);
                row.appendChild(iframe);
                this.#container.appendChild(row);

            }
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

            if(url.hd == isHD && url.viewers > embed.viewers){

                embed = structuredClone(url);

            }

        }
        return embed;

    }
    

}

export default Screen;