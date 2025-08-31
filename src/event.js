import Popup from "/modules/Popup.js";

function fetchSport(value){
    
}

async function setScreen(sourceObj){
    
    window.controller.isInPopup = false;
    let streamPopup = document.getElementById("streamPopup");
    streamPopup.classList.remove("ontop");
    streamPopup.innerHTML = "";
    await window.screenObj.newScreen(sourceObj, parseInt(streamPopup.getAttribute("forScreen")));
}

async function newScreen(){
    window.controller.isInPopup = true;
    let popup = new Popup(window.screenObj.length);
    popup.show();
    await popup.init();
}


window.fetchSport = fetchSport;
window.setScreen = setScreen;
window.newScreen = newScreen;