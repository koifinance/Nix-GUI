// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
declare const require: any;

export const environment = {
  production: false,
  envName: 'dev',
  version: require('../../package.json').version,
  nixHost: 'localhost',
  releasesUrl: 'https://github.com/NixPlatform/NixCore/releases/tag/v2.0.0',
  nix_MainNet_Port :51735,
  nixPort: 51935,
  rpcUserName :'test',
  rpcPassword :'test',
};
