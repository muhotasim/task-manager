const {BrowserWindow,globalShortcut} = require('electron');
const path = require("path");
const config = require("../config.json");
function createWindow (id) {
    let mainWindow = new BrowserWindow({
        height:500,
        width:800,
        title:config.title,
        webPreferences:{
            contextIsolation:false,
            nodeIntegration:true
            
        },
        autoHideMenuBar:true,
       
        
    })
    
    mainWindow.loadURL("file://"+path.resolve(__dirname,"../templates/todo-list/index.html")+"?id="+id);
    
    

    return mainWindow;
}

module.exports = createWindow;