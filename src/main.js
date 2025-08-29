import Controller from "./modules/Controller.js";
import APIHandler from "./modules/APIHandler.js";
import Popup from "./modules/Popup.js";
import Screen from "./modules/Screen.js";


    // const { invoke } = window.__TAURI__.core;

var screen;

window.onload = async ()=> {

    screen = new Screen();
    // const webview = new Webview(appWindow, 'theUniqueLabel', {
    // url: 'https://embedsports.top/embed/alpha/new-zealand-warriors-vs-parramatta-eels/1',

    // // create a webview with specific logical position and size
    // x: 0,
    // y: 0,
    // width: 800,
    // height: 600,
    // });

    window.screenObj = screen
};
