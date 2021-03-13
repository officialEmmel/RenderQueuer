const { app, BrowserWindow } = require('electron');
var fs = require('fs');
//const electron = require('electron'); 
const path = require('path');
const icon = __dirname + "/icon.ico"

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({ 
    width: 350, 
    height: 600,
    icon: icon, 
    webPreferences: { 
         enableRemoteModule: true,
         nodeIntegration: true
    }
  })
  mainWindow.setMenuBarVisibility(false) 
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  

  // Open the DevTools.
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



/////////////////////////////////////////////////////////
