class Controller{

    isInPopup;

    #screenFocusIndex = 0;

    constructor(){

        this.isInPopup = true;

        document.body.onkeyup = (ev)=>{
            ev.preventDefault();
            switch (ev.code){
                case "ArrowLeft":
                    this.left();
                break;
                case "ArrowRight":
                    this.right();
                break;
                case "ArrowUp":
                    this.up();
                break;
                case "ArrowDown":
                    this.down();
                break;
                case "Enter":
                case "MailReply":
                    this.enter();
                break;
                default:
                    alert(ev.code, ev.key, ev.keyCode, ev.which);
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
    enter(){

        let focused = this.#findFocused();
        focused.click();
        
        // if(focused.classList.contains("embed")){
            
        //     // alert($(".focused").contents().find(".clickable:first"));

        // }

    }

    #screenNavigation(direction){

        let focused = this.#findFocused();

        let target;
        
        let index = 0;

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
            let prevParent = focused.parentElement.previousElementSibling;

            if(prevParent){

                let embeds = prevParent.querySelectorAll(".embed");
                let index = 0;
                if(embeds.length - 1 >= focused.getAttribute("screenNo") % 2){
                    index = focused.getAttribute("screenNo") % 2
                }
                else {
                    index = embeds.length-1;
                }
                target = embeds[index];

            }
            else {
                target = focused;
            }
        }
        else if(direction == "down"){
            let nextParent = focused.parentElement.nextElementSibling;

            if(nextParent){

                let embeds = nextParent.querySelectorAll(".embed");
                let index = 0;
                if(embeds.length -1 >= focused.getAttribute("screenNo") % 2){
                    index = focused.getAttribute("screenNo") % 2;
                }
                else {
                    index = embeds.length - 1
                }

                target = embeds[index];
            }
            else {
                target = focused;
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
        DOM.classList.remove("focused");
        DOM.classList.add("focusable");
    }

    #addFocus(DOM){
        DOM.classList.remove("focusable");
        DOM.classList.add("focused");
    }

    click(x, y,DOM)
    {
        var ev = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'screenX': x,
            'screenY': y
        });

        var el = DOM.elementFromPoint(x, y);
        console.log(el); //print element to console
        el.dispatchEvent(ev);
    }

}

export default Controller;
