declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  envName: 'prod',
  nixHost: 'domain.com',
  releasesUrl: 'https://api.github.com/repos/nixplatform/nix-gui/releases/latest',
  nix_MainNet_Port :6215,
  nixPort: 6214,
  rpcUserName :'test',
  rpcPassword :'test',
};
