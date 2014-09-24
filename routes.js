module.exports = function(app) {

  // load handlers
  var dashboard = require('./handlers/dashboard')(app);
  var api = require('./handlers/api/index')(app);

  // setup routes
  app.get('/', dashboard.index);

  // search for an episode
  app.route('/api/search')
    .get(api.search.episode);

  // list all shows
  app.route('/api/shows')
    .get(api.shows.index);

  // show details
  app.route('/api/shows/:tvdbid')
    .get(api.shows.show);

  // get the poster for a show
  app.route('/api/shows/:tvdbid/poster')
    .get(api.shows.poster);

  // get the banner for a show
  app.route('/api/shows/:tvdbid/banner')
    .get(api.shows.banner);

  // list the seasons for a show
  app.route('/api/shows/:tvdbid/seasons')
    .get(api.seasons.index);

  // show all the episodes for a given season
  app.route('/api/shows/:tvdbid/seasons/:season')
    .get(api.seasons.show);

  // episode details
  app.route('/api/shows/:tvdbid/seasons/:season/episodes/:episode')
    .get(api.episodes.show);

  // show all downloads in sab
  app.route('/api/downloads/queue')
    .get(api.downloads.queue);
};
