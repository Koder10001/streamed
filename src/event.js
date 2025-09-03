import Popup from "/modules/Popup.js";

async function fetchSport(DOM){
    
    let popup = new Popup();
    if(DOM.value == "all"){
        await popup.init();
    }
    else {
        await popup.init({id: DOM.value, name: DOM.options[DOM.selectedIndex].text});
    }
}

function editScreen(DOM){
    ControllerObj.isInPopup = true;
    deleteScreen(DOM);
    
    let popup = new Popup(DOM);
    popup.init();
    popup.show();
    
}

function deleteScreen(DOM){
    DOM.remove();
    ScreenObj.reArrange();
}

function mouseOver(DOM){
    ControllerObj.updateFocus(DOM);
}

async function setScreen(sourceObj){
    ControllerObj.isInPopup = false;
    let streamPopup = document.getElementById("streamPopup");
    streamPopup.classList.remove("ontop");
    await ScreenObj.newScreen(sourceObj);
}

async function newScreen(){
    ControllerObj.isInPopup = true;
    let popup = new Popup(ScreenObj.length);
    popup.show();
    await popup.init();
}

setInterval(()=>{
    if(document.activeElement.classList.contains("embed")){
        ControllerObj.updateFocus(document.activeElement);
    }
}, 750);

window.fetchSport = fetchSport;
window.setScreen = setScreen;
window.newScreen = newScreen;
window.mouseOver = mouseOver;
window.fetchSport = fetchSport;
window.editScreen = editScreen;
window.deleteScreen = deleteScreen;