class Controller{

    isInPopup;

    #screenFocusIndex = 0;

    #lastClickTime = Date.now();
    #lastBtnStreak = 0;



    constructor(){

        this.isInPopup = true;

        window.onkeydown = (ev)=>{
            ev.preventDefault();

            switch (ev.keyCode){
                case 37:
                    this.#lastBtnStreak = 0;
                    this.left();
                break;
                case 39:
                    this.#lastBtnStreak = 0;
                    this.right();
                break;
                case 38:
                    this.#lastBtnStreak = 0;
                    this.up();
                break;
                case 40:
                    this.#lastBtnStreak = 0;
                    this.down();
                break;
                case 13:

                
                    let timeNow = Date.now();
                    this.#lastBtnStreak += 1;

                    if(this.#lastBtnStreak == 1){
                        setTimeout(this.#waitForNextInput.bind(this),500);
                    }
                    else if (timeNow - this.#lastClickTime > 600) {
                        this.#lastBtnStreak = 1;
                        setTimeout(this.#waitForNextInput.bind(this),500);
                    }

                    this.#lastClickTime = timeNow;


                break;
                default:
                    // alert(ev.keyCode);
                break;
            }

        };

    }
    left(){
        
        if(this.isInPopup){
            this.#popupNavigation("left");
            return;
        }

        this.#screenNavigation("left")

    }
    right(){

        if(this.isInPopup){
            this.#popupNavigation("right");
            return;
        }

        // for screen 

        this.#screenNavigation("right")
    }
    up(){

        if(this.isInPopup){
            this.#popupNavigation("up");
            return;
        }

        this.#screenNavigation("up")
    }
    down(){

        if(this.isInPopup){
            this.#popupNavigation("down")
            return;
        }

        this.#screenNavigation("down")

    }
    enter(isDoubleClick = false, isHold = false){

        // for select tag

        let focused = this.#findFocused();
        if(!isDoubleClick && !isHold){
            focused.click();
        }
        else if(isDoubleClick){
            let ev = new Event("dblclick");
            focused.dispatchEvent(ev);
        }
        else {
            deleteScreen(this.#findFocused());
        }

    }

    #screenNavigation(direction){

        let focused = this.#findFocused();

        let target;

        let embedArr = document.querySelectorAll(".embed");

        if(focused.id == "add"){
            target = embedArr[Math.floor(embedArr.length / 2)];
        }
        else if(direction == "left"){
            target = focused.previousElementSibling?focused.previousElementSibling:focused;
        }
        else if(direction == "right"){
            if(!focused.nextElementSibling){
                target = document.getElementById("add");
            }
            else {
                target = focused.nextElementSibling?focused.nextElementSibling:focused;
            }
        }
        else if(direction == "up"){

            let currentFocus = this.#findFocused();

            let embeds = document.querySelectorAll(".embed");

            let index = Array.prototype.indexOf.call(embeds, currentFocus) % document.querySelectorAll(".row").length;

            if ( currentFocus.parentElement.previousElementSibling ){

                if(index > currentFocus.parentElement.previousElementSibling.children.length - 1){
                    index = currentFocus.parentElement.previousElementSibling.children.length - 1;
                }

                this.#removeFocus(currentFocus);
                this.#addFocus(currentFocus.parentElement.previousElementSibling.children[index])

            }
            
        }
        else if(direction == "down"){

            let currentFocus = this.#findFocused();

            let embeds = document.querySelectorAll(".embed");

            let index = Array.prototype.indexOf.call(embeds, currentFocus) % document.querySelectorAll(".row").length;

            if ( currentFocus.parentElement.nextElementSibling ){

                if(index > currentFocus.parentElement.nextElementSibling.children.length - 1){
                    index = currentFocus.parentElement.nextElementSibling.children.length - 1;
                }

                this.#removeFocus(currentFocus);
                this.#addFocus(currentFocus.parentElement.nextElementSibling.children[index])

            }

        }

        this.#removeFocus(focused);
        this.#addFocus(target);
    }

    #popupNavigation(direction){
        
        let focused = this.#findFocused();
        let target;

        switch(direction){
            case "down":

                // for select tag and match class 
                if(focused.tagName == "SELECT"){
                    target = document.getElementById("streamPopup").querySelector(".match");
                }
                if(focused.className == "match focused"){
                    target = focused.parentElement.parentElement.nextElementSibling.querySelector(".match");
                }
                this.#addFocus(target);
                this.#removeFocus(focused);
                target.scrollIntoView({ behavior: 'smooth' , inline: "nearest", block: "center"});
                return;
            case "up":
            
                // to go backup to select
                if(focused.parentElement.parentElement == document.querySelector(".streamRow")){
                    target = document.getElementById("sport");
                }
                else if(focused.className == "match focused"){
                    target = focused.parentElement.parentElement.previousElementSibling.querySelector(".match");
                }
                this.#addFocus(target);
                this.#removeFocus(focused);
                target.scrollIntoView({ behavior: 'smooth' , inline: "nearest", block: "center"});
                return;
            case "right":
                // for select tag
                if(focused.tagName == "SELECT"){
                    if(focused.selectedIndex < focused.options.length - 1){
                        focused.selectedIndex += 1;
                    }
                    return;
                }

                // for match class
                if(focused.className == "match focused"){
                    let target = focused.nextElementSibling;
                    this.#addFocus(target);
                    this.#removeFocus(focused);
                    target.scrollIntoView({ behavior: 'smooth' , inline: "nearest", block: "center"});
                    return;
                }
                break;
            case "left":
                // for select tag
                if(focused.tagName == "SELECT"){
                    if(focused.selectedIndex > 0){
                        focused.selectedIndex -= 1;
                    }
                    return;
                }

                // for match class
                if(focused.className == "match focused"){
                    let target = focused.previousElementSibling;
                    this.#addFocus(target);
                    this.#removeFocus(focused);
                    target.scrollIntoView({ behavior: 'smooth' , inline: "nearest", block: "center"});
                    return;
                }
                break;
        }

    }

    #findFocused(){
        if(this.isInPopup){

            let focus = document.getElementById("streamPopup").querySelectorAll(".focused");
            if(focus.length < 1 || focus.length > 1){
                for(let dom of focus){
                    dom.classList.remove("focused");
                }
                let def = document.getElementById("sport")
                this.#addFocus(def);
                return def;
            }
            return focus[0];

        }
        else {
            let focus = document.getElementById("container").querySelectorAll(".focused");
            if(focus.length < 1 || focus.length > 1){
                for(let dom of focus){
                    dom.classList.remove("focused");
                }
                let def = document.getElementById("add")
                this.#addFocus(def);
                return def;
            }
            return focus[0];
        }
    }

    #removeFocus(DOM){
        DOM.classList.add("focusable");
        DOM.classList.remove("focused");
    }

    #addFocus(DOM){
        DOM.classList.add("focused");
        DOM.classList.remove("focusable");
        if(DOM.classList.contains("embed")){
            DOM.blur();
        }
    }

    updateFocus(DOM){
        this.#removeFocus(this.#findFocused());
        this.#addFocus(DOM);
    }

    #waitForNextInput(){
        switch(this.#lastBtnStreak){
            case 1:
                this.enter();
                this.#lastBtnStreak = 1;
                break;
            case 2:
                this.enter(true, false);
                this.#lastBtnStreak = 1;
                break;
            default:
                this.enter(false,true);
                break;
        }
    }

}

export default Controller;
