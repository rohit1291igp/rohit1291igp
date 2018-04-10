// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  log : true,
  origin: 'http://35.153.168.113:8081/',
  //origin: 'http://192.168.0.156:8083/',
  originMock: 'https://5a43a511342c490012f3fca2.mockapi.io/',
  productsURL : "https://d1xs5fw35mbn8b.cloudfront.net/p/",
  productsCompURL : "http://admin.indiangiftsportal.com/handelscomponents/",
  isMobile:window.screen.width < 1000,
  userType:localStorage.getItem('userType'),
  mockAPI:sessionStorage.getItem('mockAPI')
};
