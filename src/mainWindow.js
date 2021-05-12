const {BrowserWindow,globalShortcut} = require('electron');
const path = require("path");
const config = require("../config.json");
function createWindow () {
    let mainWindow = new BrowserWindow({
        height:config.height,
        width:config.width,
        title:config.title,
        webPreferences:{
            contextIsolation:false,
            nodeIntegration:true
            
        }
    })
   
    mainWindow.loadFile(path.resolve(__dirname,"../templates/main/index.html"));

    return mainWindow;
}

module.exports = createWindow;