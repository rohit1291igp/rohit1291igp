// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  log : true,
 // origin: 'http://35.171.85.169:8081/',54.88.211.119
  //  origin: 'http://34.229.23.111:8081/',
  origin:'http://18.233.106.34:8081/',
  // origin:'http://adminapi.igp.com/',
  originMock: 'https://5a43a511342c490012f3fca2.mockapi.io/',
  productsURL : 'https://d1xs5fw35mbn8b.cloudfront.net/p/',
  productsCompURL : 'http://admin.indiangiftsportal.com/handelscomponents/',
  isMobile: window.screen.width < 1000,
  userType: localStorage.getItem('userType'),
  mockAPI: sessionStorage.getItem('mockAPI'),
  deliveryBoyEnabled: localStorage.getItem('deliveryBoyEnabled') ,
  s3AccessKey : '',
  s3SecretKey : '', 
  // s3AccessKey : 'AKIAIYVR3IZCNZG4TU4Q',
  // s3SecretKey : '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',
  blogBucketName : 'blogcreatives',
  componentBucketName : 'handelscomponents',
  igpBlogCDN : 'https://cdn.igp.com/f_auto,q_auto,t_blogimage/blogs/',
  interfloraBlogCDN : 'https://res.cloudinary.com/interflora/f_auto,q_auto,t_blogimage/blogs/',
  componentImageUrl : 'https://handelscomponents.s3.amazonaws.com/',
  blogsAcl : 'public-read'
};
