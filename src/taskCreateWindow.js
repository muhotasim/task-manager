const {BrowserWindow,globalShortcut} = require('electron');
const path = require("path");
const config = require("../config.json");
function createWindow () {
    let mainWindow = new BrowserWindow({
        height:400,
        width:500,
        title:config.title,
        webPreferences:{
            contextIsolation:false,
            nodeIntegration:true
            
        }
    })
   
    mainWindow.loadFile(path.resolve(__dirname,"../templates/create/index.html"));

    return mainWindow;
}

module.exports = createWindow;