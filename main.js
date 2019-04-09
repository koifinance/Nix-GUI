
/* electron */
const electron = require('electron');
const app = electron.app;
const { autoUpdater } = require('electron-updater');
const BrowserWindow = electron.BrowserWindow;
const menu          = electron.Menu;
const dialog        = electron.dialog;
const path          = require('path');
const fs            = require('fs');
const url           = require('url');
const platform      = require('os').platform();
const rxIpc         = require('rx-ipc-electron/lib/main').default;
const Observable    = require('rxjs/Observable').Observable;
const log           = require('electron-log');
const isDev         = require('electron-is-dev');

// require('update-electron-app')({
//   repo: 'NixPlatform/nix-gui-private',
//   updateInterval: '5 minutes',
//   logger: require('electron-log')
// })

/* make userDataPath if it doesn't exist yet */
const userDataPath = app.getPath('userData');
if (!fs.existsSync(userDataPath)) {
  fs.mkdir(userDataPath);
}

/* initialize logging */
log.transports.file.level = 'debug';
log.transports.file.appName = (process.platform == 'linux' ? '.nix' : 'nix');
log.transports.file.file = log.transports.file
  .findLogPath(log.transports.file.appName)
  .replace('log.log', 'nix.log');

log.debug(`console log level: ${log.transports.console.level}`);
log.debug(`file log level: ${log.transports.file.level}`);

const _options = require('./modules/options');
const init = require('./modules/init');
const rpc = require('./modules/rpc/rpc');
const daemon = require('./modules/daemon/daemon');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;
let options;
let openDevTools = false;

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
// const sendStatusToWindow = (text) => {
//   log.info(text);
// };

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// });
// autoUpdater.on('update-available', info => {
//   sendStatusToWindow('Update available.');
// });
// autoUpdater.on('update-not-available', info => {
//   sendStatusToWindow('Update not available.');
// });
// autoUpdater.on('error', err => {
//   sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
// });
// autoUpdater.on('download-progress', progressObj => {
//   sendStatusToWindow(
//     `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
//   );
// });
// autoUpdater.on('update-downloaded', info => {
//   sendStatusToWindow('Update downloaded; will install now');
// });

// autoUpdater.on('update-downloaded', info => {
//   // Wait 5 seconds, then quit and install
//   // In your application, you don't need to wait 500 ms.
//   // You could call autoUpdater.quitAndInstall(); immediately
//   electron.dialog.showMessageBox({
//     message: 'New version is released. Please update your desktop wallet.'
//   }, res => {
//     autoUpdater.quitAndInstall();
//   })
// });

if (process.argv.includes('-opendevtools'))
  openDevTools = true;

if (app.getVersion().includes('RC'))
  process.argv.push(...['-testnet', '-printtoconsole']);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  log.debug('app ready')
  options = _options.parse();
  initMainWindow();
  init.start(mainWindow);

  // Create the Application's main menu
  let template = [{
      label: "Application",
      submenu: [
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  ];

  menu.setApplicationMenu(menu.buildFromTemplate(template));
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    initMainWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

/*
** initiates the Main Window
*/
function initMainWindow() {
  if (platform !== "darwin") {
    let trayImage = makeTray();
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: on Win, the width of app is few px smaller than it should be
    // (this triggers smaller breakpoints) - this size should cause
    // the same layout results on all OSes
    // minWidth/minHeight: both need to be specified or none will work
    width:     1270,
    minWidth:  1270,
    height:    860,
    minHeight: 675,
    icon:      path.join(__dirname, 'resources/icon.png'),

    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // and load the index.html of the app.
  if (options.dev) {
    mainWindow.loadURL('http://localhost:4200');
  } else {
    mainWindow.loadURL(url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist/index.html'),
      slashes: true
    }));
  }

  // mainWindow.openDevTools();

  // Open the DevTools.
  if (openDevTools || options.devtools) {
    mainWindow.webContents.openDevTools()
  }

  // handle external URIs
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  // trigger autoupdate check
  autoUpdater.checkForUpdates();

  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 600 * 1000)

}

/*
** creates the tray icon and menu
*/
function makeTray() {

  // Default tray image + icon
  let trayImage = path.join(__dirname, 'resources/icon.png');

  // Determine appropriate icon for platform
  // if (platform === 'darwin') {
  //    trayImage = path.join(__dirname, 'src/assets/icons/logo.icns');
  // }
  // else if (platform === 'win32' || platform === 'win64') {
  //   trayImage = path.join(__dirname, 'src/assets/icons/logo.ico');
  // }

  // The tray context menu
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          click() { mainWindow.webContents.reloadIgnoringCache(); }
        },
        {
          label: 'Open Dev Tools',
          click() { mainWindow.openDevTools(); }
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          label: 'Close',
          click() { app.quit() }
        },
        {
          label: 'Hide',
          click() { mainWindow.hide(); }
        },
        {
          label: 'Show',
          click() { mainWindow.show(); }
        },
        {
          label: 'Maximize',
          click() { mainWindow.maximize(); }
        } /* TODO: stop full screen somehow,
        {
          label: 'Toggle Full Screen',
          click () {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
           }
        }*/
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About ' + app.getName(),
          click() { electron.shell.openExternal('https://nixplatform.io/#about'); }
        },
        {
          label: 'Visit Nixplatform.io',
          click() { electron.shell.openExternal('https://nixplatform.io'); }
        },
        {
          label: 'Visit Electron',
          click() { electron.shell.openExternal('https://electron.atom.io'); }
        }
      ]
    }
  ]);

  // Create the tray icon
  tray = new electron.Tray(trayImage)

  // TODO, tray pressed icon for OSX? :)
  // if (platform === "darwin") {
  //   tray.setPressedImage(imageFolder + '/osx/trayHighlight.png');
  // }

  // Set the tray icon
  tray.setToolTip('Nix ' + app.getVersion());
  tray.setContextMenu(contextMenu)

  // Always show window when tray icon clicked
  tray.on('click', function () {
    mainWindow.show();
  });

  return trayImage;
}
