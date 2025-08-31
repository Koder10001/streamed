import APIHandler from "./APIHandler.js";

class Popup{

    #favorites = ["basketball","football","american-football","fight","tennis"]
    #screenNo;

    #popupDOM;
    #sportObj;

    #api = new APIHandler();

    constructor(screenNo){
        this.#screenNo = screenNo;
        // reset popup
        this.#popupDOM = document.getElementById("streamPopup");
        this.#popupDOM.setAttribute("forScreen",screenNo);
        
    }


    async init(){

        this.#sportObj = await this.#api.getAllSport();


        let template = `
        <div tabindex="-1" class="selectRow">

            <select tabindex="-1" id="sport" class="focusable" onchange="fetchSport(this.value)">
                <option tabindex="-1" value="all">All Sport</option>
                ${await this.listSportsType()}
            </select>

        </div>
        <div tabindex="-1" id="sports">
            ${await this.listSports()}
        </div>`
        this.#popupDOM.innerHTML = template;
    }

    async listSportsType(){
        let optionDOMs = "";

        for(let sport of this.#sportObj){

            optionDOMs += `<option tabindex="-1" value="${sport.id}">${sport.name}</option>\n`;

        }
        return optionDOMs;
    }

    async listSports(endpoint = undefined){
        let matchList = "";

        if(endpoint == undefined){
            endpoint = this.#api.getSportSpecificMatches;
        }

        for(let sport of this.#sportObj){
            if(this.#favorites.indexOf(sport.id) != -1){

                let matches = await endpoint.bind(this.#api)(sport.id);

                let matchCard = "";

                for( let match of matches){

                    let teamVSteam = match.title.split(/ vs | - /);

                    let secondTeam = "";

                    if (teamVSteam.length > 1){
                        secondTeam = `
                        <span tabindex="-1" class="vs">--------</span>
                        <span tabindex="-1">${teamVSteam[1]}</span>`;
                    }

                    let banner = "";
                    

                    if(match.poster){

                        banner += `<img tabindex="-1" src=${this.#api.host+match.poster}/>`;

                    }

                    banner += `
                        <div tabindex="-1" class="title">
                            <span tabindex="-1">${teamVSteam[0]}</span>
                            ${secondTeam}
                        </div>`

                    matchCard += `
                        <div tabindex="-1" class="match" class="focusable" onclick='setScreen(${JSON.stringify(match.sources)})'>
                            ${banner}
                        </div>`
                    
                }
                
                let streamRow = `
                    <div tabindex="-1" class="streamRow">
                        <div tabindex="-1" class="sportType">${sport.name}</div>
                        <div tabindex="-1" class="streamList">
                            ${matchCard}
                        </div>
                    </div>`

                matchList += streamRow + "\n";
            }
        }
        return matchList;
    }

    show(){
        
        this.#popupDOM.classList.add("ontop");

    }

    hide(){
        this.#popupDOM.classList.remove("ontop");
    }



}

export default Popup;