module.exports = function(app) {

  // load handlers
  var dashboard = require('./handlers/dashboard')(app);
  var api = require('./handlers/api/index')(app);

  // setup routes
  app.get('/', dashboard.index);

  app.route('/api/search')
    .get(api.search.episode);

  app.route('/api/shows')
    .get(api.shows.index);

  app.route('/api/shows/:tvdbid')
    .get(api.shows.show);

  app.route('/api/shows/:tvdbid/poster')
    .get(api.shows.poster);

  app.route('/api/shows/:tvdbid/seasons/:season/episodes/:episode')
    .get(api.episodes.show);

  app.route('/api/downloads/queue')
    .get(api.downloads.queue);
};
