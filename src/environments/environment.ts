// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
declare const require: any;

export const environment = {
  production: false,
  envName: 'dev',
  version: require('../../package.json').version,
  nixHost: '127.0.0.1',
  releasesUrl: 'https://api.github.com/repos/NixPlatform/Nix-GUI/releases/latest',
  nix_MainNet_Port: 6215,
  nixPort: 6214,
  rpcUserName: 'test',
  rpcPassword: 'test',
};
