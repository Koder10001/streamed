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
        
    }


    async init(){
        this.#popupDOM.classList.add("ontop");


        this.#sportObj = await this.#api.getAllSport();


        let template = `
        <div class="selectRow">

            <select id="sport" onchange="fetchSport()">
                <option value="all">All Sport</option>
                ${await this.listSportsType()}
            </select>

        </div>
        <div id="sports">
            ${await this.listFavSports()}
        </div>`
        this.#popupDOM.innerHTML = template;
    }

    async listSportsType(){
        let optionDOMs = "";

        for(let sport of this.#sportObj){

            optionDOMs += `<option value="${sport.id}">${sport.name}</option>\n`;

        }
        return optionDOMs;
    }

    async listFavSports(){
        let matchList = "";
        for(let sport of this.#sportObj){
            if(this.#favorites.indexOf(sport.id) != -1){

                let matches = await this.#api.getSportSpecificMatches(sport.id);

                let matchCard = "";

                for( let match of matches){

                    let teamVSteam = match.title.split(" vs ");

                    let banner = "";
                    

                    if(match.poster){

                        banner += `<img src=${this.#api.host+match.poster}/>`;

                    }

                    banner += `
                        <div class="title">
                            <span>${teamVSteam[0]}</span>
                            <span>VS</span>
                            <span>${teamVSteam[1]}</span>
                        </div>`

                    matchCard += `
                        <div class="match" onclick='setScreen(${JSON.stringify(match.sources)},${this.#screenNo})'>
                            ${banner}
                        </div>`
                    
                }
                
                let streamRow = `
                    <div class="streamRow">
                        <div class="sportType">${sport.name}</div>
                        <div class="streamList">
                            ${matchCard}
                        </div>
                    </div>`

                matchList += streamRow + "\n";
            }
        }
        return matchList;
    }

    static removePopup(){
        document.getElementById("streamPopup").classList.remove("ontop");
    }


}

export default Popup;