

function fetchSport(){
    
}

async function setScreen(sourceObj, screenNo){
    
    document.getElementById("streamPopup").classList.remove("ontop");

    await window.screenObj.newScreen(sourceObj, screenNo);

}

window.setScreen = setScreen;