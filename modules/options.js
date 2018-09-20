const path = require('path');

let _options = {};

/*
** compose options from arguments
**
** exemple:
** --dev -testnet -reindex -rpcuser=user -rpcpassword=pass
** strips --dev out of argv (double dash is not a particld argument) and returns
** {
**   dev: true,
**   testnet: true,
**   reindex: true,
**   rpcuser: user,
**   rpcpassword: pass
** }
*/
exports.parse = function() {

  let options = {};
  if (process.argv[0].match(/[Ee]lectron/)) {
    // striping 'electron .' from argv
    process.argv = process.argv.splice(2);
  } else {
    // striping /path/to/nix from argv
    process.argv = process.argv.splice(1);
  }

  process.argv.forEach((arg, index) => {
    if (arg.includes('=')) {
      arg = arg.split('=');
      options[arg[0].substr(1)] = arg[1];
    } else if (arg[1] === '-'){
      // double dash command
      options[arg.substr(2)] = true;
    } else if (arg[0] === '-') {
      // simple dash command
      options[arg.substr(1)] = true;
    }
  });

  options.port = options.rpcport
    ? options.rpcport // custom rpc port
    : options.testnet
      ? 6215  // default testnet port
      : 6214; // default mainnet port

  _options = options;
  return options;
}

exports.get = function() {
  return _options;
}
