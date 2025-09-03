import APIHandler from "./APIHandler.js";

class Popup{

    #favorites = ["basketball","football","american-football","fight","tennis"]
    #replaceTarget;

    #popupDOM;
    #sportObj;

    #api = new APIHandler();

    constructor(){

        // reset popup
        this.#popupDOM = document.getElementById("streamPopup");
        this.#popupDOM.innerHTML = "";
        
    }


    async init(sportObj = undefined){

        this.#sportObj = await this.#api.getAllSport();

        let template = `
        <div tabindex="-1" class="selectRow">

            <select tabindex="-1" id="sport" onclick="fetchSport(this)" onmousemove="mouseOver(this)" class="focused">
                <option tabindex="-1" value="all" name="all">All Sport</option>
                ${await this.listSportsType(sportObj)}
            </select>

        </div>
        <div tabindex="-1" id="sports">
            ${await this.listSports(sportObj)}
        </div>`
        this.#popupDOM.innerHTML = template;
    }

    async listSportsType(sportObj = undefined){
        let optionDOMs = "";

        for(let sport of this.#sportObj){

            if(sportObj && sport.id == sportObj.id){
                optionDOMs += `<option tabindex="-1" selected value="${sport.id}">${sport.name}</option>\n`;
                continue
            }
            optionDOMs += `<option tabindex="-1" value="${sport.id}">${sport.name}</option>\n`;
            

        }
        return optionDOMs;
    }

    async listSports(sportObj = undefined){
        let matchList = "";

        let target = this.#sportObj;

        if(sportObj){
            target = [sportObj];
        }

        for(let sport of target){
            if(this.#favorites.indexOf(sport.id) != -1){

                let matches = await this.#api.getSportSpecificMatches(sport.id);

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
                        <div tabindex="-1" class="match" onmousemove="mouseOver(this)" class="focusable" onclick='setScreen(${JSON.stringify(match.sources)})'>
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
        this.#popupDOM.innerHTML = "";
    }



}

export default Popup;