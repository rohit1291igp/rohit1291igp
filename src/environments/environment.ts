// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  log : true,
  //origin: 'http://localhost:1337/',
  origin: 'http://34.204.124.92:8080/',
  apiInitial : 'IGPService/web/services/rest',
  productsURL : "https://d1xs5fw35mbn8b.cloudfront.net/p/m/",
  productsCompURL : "assets/images/"
};
