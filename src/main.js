import Controller from "/modules/Controller.js";
import Screen from "/modules/Screen.js";


    // const { invoke } = window.__TAURI__.core;

window.onload = async ()=> {

    let screen = new Screen();
    
    let controller = new Controller();

    window.ScreenObj = screen
    window.ControllerObj = controller;
};

window.onbeforeunload = (ev)=>{
    ev.preventDefault();
}