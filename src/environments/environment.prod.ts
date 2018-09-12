declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  envName: 'prod',
  nixHost: 'domain.com',
  releasesUrl: 'https://github.com/NixPlatform/NixCore/releases/tag/v2.0.0',
  nix_MainNet_Port :4201,
  nixPort: 4200,
  rpcUserName :'test',
  rpcPassword :'12345678',
};
