const {fetch} = window.__TAURI__.http;

class APIHandler{

    #hosts = ["https://streami.su", "https://streamed.st","https://streamed.pk"];
    #currentHostIndex = 0;
    #select;
    #popup;

    constructor(){

    }

    async #req(url){
        let response = await fetch(url, 
            {
                method: "GET",
                mode: "no-cors",
                headers: {'Content-Type': 'application/json'},
            }
        );
        
        if(!response.ok){
            console.log("Request failed retrying next hosts");
            this.#changeHost();
            //this.#req(url);
            return;
        }
        return await response.json();
    }

    get host(){
        return this.#hosts[this.#currentHostIndex];
    }

    #changeHost(url){
        this.#currentHostIndex = ( this.#currentHostIndex + 1 ) % this.#hosts.length;
    }
    
    async getAllSport(){ 
        let response = await this.#req(this.#hosts[this.#currentHostIndex] + "/api/sports");
        return response;
        
    }

    async getSportSpecificMatches(sportID){ 
        let response = await this.#req(this.#hosts[this.#currentHostIndex] + "/api/matches/" + sportID);
        return response;
    }

    async getAllMatches(){ // TODO
        return this.#hosts[this.#currentHostIndex] + "/api/matches/all";
    }

    async getTodayMatches(){
        let response = await this.#req(this.#hosts[this.#currentHostIndex] + "/api/matches/all-today");
        return response;
    }

    async getLiveMatches(){ // TODO
        let response = await this.#req(this.#hosts[this.#currentHostIndex] + "/api/matches/live");
        return response
    }

    async getMatchPoster(badge){ // TODO
        let response = await this.#req(this.#hosts[this.#currentHostIndex] + `/api/images/poster/${badge}/${badge}.webp`)
        return response;
        
    }  

    async getStreams(channel,sportID){
        let response = await this.#req(this.#hosts[this.#currentHostIndex] + `/api/stream/${channel}/${sportID}`)
        return response;
    }

}

export default APIHandler;