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
  nix_MainNet_Port :4201,
  nixPort: 4200,
  rpcUserName :'test',
  rpcPassword :'12345678',
};
