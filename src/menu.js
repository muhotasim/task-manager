const {Menu, app,globalShortcut,ipcMain} = require('electron');
const taskCreateWindow = require('./taskCreateWindow');
let __task_create_window = null;
const {ProjectStore}= require("./db")
const menu = Menu.buildFromTemplate([
    {
        label:"File",
        submenu:[
            
            {
                
                label:"New",
                click:()=>{
                    onOpenTaskCreateWindow()
                }
            },
            {
                label:"Quit",
                click:()=>app.quit()
            }
        ]
    }
]);


function onOpenTaskCreateWindow (){
    __task_create_window = taskCreateWindow();
    // globalShortcut.register("Ctrl+I",()=>{
    //     __task_create_window.webContents.openDevTools()
    // })
    __task_create_window.autoHideMenuBar = true;
    return __task_create_window;
}


ipcMain.on("save-project",(e,d)=>{
    ProjectStore.insert({name:d.pName,done:0,remaining:0,inprocess:0,total:0},(err,doc)=>{
       if(err){
        
        __task_create_window.webContents.send("save",{
            success:false
        });
       }
       if(doc){
        __task_create_window.webContents.send("save",{
            success:true
        });
       }
    })
})





module.exports = menu;