const {BrowserWindow,app,Menu,globalShortcut,ipcMain,ipcRenderer} = require('electron');
const {ProjectStore}= require("./db")
const mainWindow = require('./mainWindow');
const taskWindow = require('./taskWindow');
const menu = require('./menu');
let __main_window = null;
let __task_window = null;

app.on("ready",()=>{
    __main_window = mainWindow();
    // globalShortcut.register("Ctrl+I",()=>{
    //     __main_window.webContents.openDevTools()
    // })
    Menu.setApplicationMenu(menu);
})


app.on("window-all-closed",()=>{
    app.quit();
})

function onOpenTaskWindow (_id){
    __task_window = taskWindow(_id);
    // globalShortcut.register("Ctrl+I",()=>{
    //     __task_window.webContents.openDevTools()
    // })
    globalShortcut.register("Ctrl+I",()=>{
        __task_window.webContents.openDevTools()
    })
    __task_window.autoHideMenuBar = true;
    
    __task_window.webContents.send("id",{
        id:_id
    });
    
}


ipcMain.on("relode-table",e=>{
    __main_window.webContents.send("reload");
})

ipcMain.on("open-task-manager",(e,data)=>{
    onOpenTaskWindow(data._id);
})
