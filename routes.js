module.exports = function(app) {
  
  // load handlers
  var dashboard = require('./handlers/dashboard')(app);
  
  // setup routes
  app.get('/', dashboard.index);
  app.get('/queue', dashboard.queue);
  
  app.get('/show/:tvdbid/banner', dashboard.banner);
  app.get('/show/:tvdbid/poster', dashboard.poster);
};