import Controller from "/modules/Controller.js";
import Screen from "/modules/Screen.js";


    // const { invoke } = window.__TAURI__.core;

var screen;

window.onload = async ()=> {

    screen = new Screen();
    
    let controller = new Controller();

    window.screenObj = screen
    window.controller = controller;
};

window.onbeforeunload = (ev)=>{
    ev.preventDefault();
}