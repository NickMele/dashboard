module.exports = function(app) {
  
  // load handlers
  var dashboard = require('./handlers/dashboard')(app);
  
  // setup routes
  app.get('/', dashboard.index);
  app.get('/queue', dashboard.queue);
  
  app.namespace('/api', function() {
    app.get('/show/banner', dashboard.banner);
    app.get('/show/poster', dashboard.poster);
    app.get('/show/episode.search', dashboard.episode.search);
  });
};