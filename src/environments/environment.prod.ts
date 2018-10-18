export const environment = {
  production: true,
  log : false,
  origin: 'http://34.204.124.92:8081/',
  originMock: 'https://5a43a511342c490012f3fca2.mockapi.io/',
  apiInitial : 'IGPService/web/services/rest',
  productsURL : 'https://d1xs5fw35mbn8b.cloudfront.net/p/',
  productsCompURL : 'http://admin.indiangiftsportal.com/handelscomponents/',
  isMobile: window.screen.width < 1000,
  userType: localStorage.getItem('userType'),
  mockAPI: sessionStorage.getItem('mockAPI'),
  s3AccessKey : 'AKIAJVEU6UYKL7BCJMZA',
  s3SecretKey : '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', 
  blogBucketName : 'blogcreatives',
  igpBlogCDN : 'https://cdn.igp.com/f_auto,q_auto,t_blogimage/blogs/',
  interfloraBlogCDN : 'https://res.cloudinary.com/interflora/f_auto,q_auto,t_blogimage/blogs/',
  blogsAcl : 'public-read'
};
