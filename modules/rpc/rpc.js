const log         = require('electron-log');
const http        = require('http');
const fs          = require('fs');
const electron    = require('electron');
const rxIpc       = require('rx-ipc-electron/lib/main').default;
const Observable  = require('rxjs/Observable').Observable;

const cookie      = require('./cookie');
const _options    = require('../options');
const got         = require('got');
const daemon      = require('../daemon/daemon');

/* spyOnRpc will output all RPC calls being made */
const spyOnRpc = true;

let HOSTNAME;
let PORT;
let TIMEOUT = 30000;
let rpcOptions;
let auth;

exports.init = function() {
  let options = _options.get();

  HOSTNAME = options.rpcbind || 'localhost';
  PORT     = options.port;
  auth     = cookie.getAuth(_options.get());

  initIpcListener();
}

exports.destroy = function() {
  destroyIpcListener();
}

/*
** execute a single RPC call
*/
exports.call = function(method, params, callback) {

  if (!auth) {
    exports.init()
  }

  if (!callback) {
    callback = function (){};
  }

  const timeout = [ 'extkeyimportmaster', 'extkeygenesisimport'].includes(method) ? 240 * 1000 : TIMEOUT; // TODO: replace
  const postData = JSON.stringify({
    method: method,
    params: params
  });
  
  if(spyOnRpc) {
    log.debug('rpc.call:', postData);
  }

  if (!rpcOptions) {
    rpcOptions = {
      hostname: HOSTNAME,
      port:     PORT,
      path:     '/',
      method:   'POST',
      headers:  { 'Content-Type': 'application/json' }
    }
  }

  if (auth && rpcOptions.auth !== auth) {
    rpcOptions.auth = auth
  }

  rpcOptions.headers['Content-Length'] = postData.length;

  const request = http.request(rpcOptions, response => {
    let data = '';
    response.setEncoding('utf8');
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      // TODO: more appropriate error handling
      if (response.statusCode === 401) {
        callback({
          status: 401,
          message: 'Unauthorized'
        });
        return ;
      }
      if (response.statusCode === 503) {
        callback({
          status: 503,
          message: 'Service Unavailable',
        });
        return ;
      }

      try {
        console.log('status code :' +response.statusCode);
        console.log('data :' +  data)
        data = JSON.parse(data);
      } catch(e) {
        log.error('ERROR: should not happen', e, data);
        callback(e);
      }

      if (data.error !== null) {
        callback(data);
        return ;
      }

      callback(null, data);
    });
  });

  request.on('error', error => {
    switch (error.code) {
      case 'ECONNRESET':
        callback({
          status: 0,
          message: 'Timeout'
        });
        break;
      case 'ECONNREFUSED':
        callback({
          status: 502,
          message: 'Daemon not connected, retrying connection',
          _error: error
        });
        break;
      default:
        callback(error);
    }
  });

  request.setTimeout(timeout, error => {
    return request.abort();
  });

  request.write(postData);
  request.end();
}

exports.getTimeoutDelay = () => { return TIMEOUT }
exports.setTimeoutDelay = function(timeout) { TIMEOUT = timeout }


/*
 * All IPC-related stuff, below here.
*/

function initIpcListener() {

  // Make sure that rpc-channel has no active listeners.
  // Better safe than sorry.
  destroyIpcListener();

  // Register new listener
  rxIpc.registerListener('rpc-channel', (method, params) => {
    return Observable.create(observer => {
      if (['restart-daemon'].includes(method)) {
        daemon.restart(() => observer.next(true));
      } else if (['setup-new-ghostnode'].includes(method)) {
        const BINARY_URL = 'https://raw.githubusercontent.com/NixPlatform/Nix-GUI/master/modules/clientBinaries/clientBinaries.json';
        got(BINARY_URL, {
          timeout: 10000,
          json: true
        }).then(res => {
          let version = res.body.clients.nixd.version; 
          version = version.substring(0, version.length - 2);         
          let commands = [
            'nix-cli stop',
            `wget https://github.com/NixPlatform/NixCore/releases/download/v${version}/nix-${version}-x86_64-linux-gnu.tar.gz;`,
            `tar -xvzf nix-${version}-x86_64-linux-gnu.tar.gz;`,
            `chmod +x -R nix-${version};`,
            `cp ./nix-${version}/bin/nixd /bin`,
            `cp ./nix-${version}/bin/nix-cli /bin`,
            `nixd -ghostnode=1 -externalip=${params[0]}:6214 -ghostnodeprivkey=${params[2]} -daemon`,
            `nix-cli getwalletinfo`
          ];
          runCommands('setup-new-ghostnode', commands, params);
          fs.appendFile(cookie.findCookiePath() + '/ghostnode.conf', `\n${params[3]} ${params[0]}:6214 ${params[2]} ${params[4]} ${params[5]}`, err => {
            if (err) throw err;
          })
        }).catch(err => {
          throw err;
        });        
      } else if (['update-nix-version'].includes(method)) {
        const BINARY_URL = 'https://raw.githubusercontent.com/NixPlatform/Nix-GUI/master/modules/clientBinaries/clientBinaries.json';
        got(BINARY_URL, {
          timeout: 10000,
          json: true
        }).then(res => {
          let version = res.body.clients.nixd.version;
          version = version.substring(0, version.length - 2);
          getPrivateKey(params[2])
          .then(ghostnodePrivKey => {
            let commands = [
              'nix-cli stop',
              `wget https://github.com/NixPlatform/NixCore/releases/download/v${version}/nix-${version}-x86_64-linux-gnu.tar.gz;`,
              `tar -xvzf nix-${version}-x86_64-linux-gnu.tar.gz;`,
              `chmod +x -R nix-${version};`,
              `cp ./nix-${version}/bin/nixd /bin`,
              `cp ./nix-${version}/bin/nix-cli /bin`,
              `nixd -ghostnode=1 -externalip=${params[0]}:6214 -ghostnodeprivkey=${ghostnodePrivKey} -daemon`,
            ];
            runCommands('update-nix-version', commands, params);
          }).catch(err => {
            throw err;
          })
        }).catch(err => {
          throw err;
        });
      } else {
        exports.call(method, params, (error, response) => {
          try {
            if(error) {
              observer.error(error);
            } else {
              observer.next(response || undefined);
              observer.complete();
            }
          } catch (err) {
            if (err.message == 'Object has been destroyed') {
              // suppress error
            } else {
              log.error(err);
            }
          }
        });
      }
    });
  });
}

function runCommands(name, commands, params) {
  let command     = '';
  let pwSent      = false;
  let sudosu      = false;
  let password    = ' ';
  let Client = require('ssh2').Client;
  let conn = new Client();
  let nix_server = false;

  conn.on('ready', () => {
    console.log('Connection :: ready');
    conn.shell( (err, stream) => {
      if (err) console.log('-------------------------', err);
      stream.on('close', () => {
        console.log('Stream :: close');
        conn.end();
      }).on('data', (data) => {
  
      //handle sudo password prompt
      if (command.indexOf("sudo") !== -1 && !pwSent) {
        //if sudo su has been sent a data event is triggered but the first event is not the password prompt
        //this will ignore the first event and only respond when the prompt is asking for the password
        if (command.indexOf("sudo su") > -1) {
            sudosu = true;
        }
        if (data.indexOf(":") >= data.length - 2) {
            pwSent = true;
            stream.write(password + '\n');
        }
      } else {
        //detect the right condition to send the next command
        let dataLength = data.length;
        if (dataLength > 2 && (data.indexOf("$") >= dataLength - 2 || data.indexOf("#") >= dataLength - 2 )) {

          if (commands.length > 0) {
            command = commands.shift();
            stream.write(command + '\n');
            console.log('==============COMMAND===============', command);
          } else {
            //sudo su requires two exit commands to close the session
            if (sudosu) {
              sudosu = false;
              stream.write('exit\n');
            } else {
              stream.end();
            }
          }
        } else {
          console.log('STDOUT: (' + command + ') -----\n' + data);
          if (data == 'NIX server starting')  nix_server = true;
          if (nix_server && command == commands[commands.length - 1] && data.length > 10 && !data.includes('error')) {
            let message;
            if (name == 'start-ghostnode') {
              message = 'Your ghostnode has been successfully started.'
            } else if (name == 'update-nix-verison') {
              message = 'NIX version of your ghostnode has been successfully updated.'
            } else if (name == 'setup-new-ghostnode') {
              message = "You've installed new ghostnode successfully. Please try to restart the wallet and start your new ghostnode.";
            }

            electron.dialog.showMessageBox({
              type: 'info',
              buttons: ['Ok'],
              message: message,
            }, (response) => {
            });
          } else if (data.includes('Error:')) {
            electron.dialog.showMessageBox({
              type: 'error',
              buttons: ['Ok'],
              message: data
            }, (response) => {
            });
          }
        }
      }
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data);
    });
  
    //first command
    command = commands.shift();
    stream.write( command + '\n' );
  
    });
  }).connect({
    host: params[0],
    port: 22,
    username: 'root',
    password: params[1],
    tryKeyboard: true,
    readyTimeout: 10000
  });
}

function getPrivateKey(aliasName) {
  return new Promise((resolve, reject) => fs.readFile(cookie.findCookiePath() + '/ghostnode.conf', 'utf8', (err, data) => {
    if (err) reject(err);
    let lines = [];
    lines = data.split('\n');

    for (let i = 0; i < lines.length; i++){
      let element = lines[i];
      if (element.indexOf(aliasName + ' ') !== -1) {
        resolve(element.split(' ')[2]);
      }
    }
  }))
}

function destroyIpcListener() {
  rxIpc.removeListeners('rpc-channel');
}