var sickbeard = require('../helpers/sickbeard')
  , sab = require('../helpers/sab')
  , _ = require('lodash')
  , async = require('async');

module.exports = function(app) {
  return {
    index: function(req, res, next) {
      var data = {};
      sickbeard.get('shows', { sort: 'name', paused: 0 }, function(error, response, json) {
        data.shows = _.where(json.data, { 'status': 'Continuing' });
        async.each(data.shows, function(show, callback) {
          sickbeard.get('show.seasonlist', { tvdbid: show.tvdbid }, function(error, response, json) {
            var latest_season = _.max(json.data);
            sickbeard.get('show.seasons', { tvdbid: show.tvdbid, season: latest_season }, function(error, response, json) {
              var episodes = _.toArray(json.data).reverse();
              show.latest_season = {
                season: latest_season,
                episodes: _.rest(episodes)
              };
              sickbeard.get('episode', { tvdbid: show.tvdbid, season: latest_season, episode: episodes.length}, function(error, response, json) {
                show.latest_episode = json.data;
                return callback();
              });
            });
          });
        }, function(error) {
          return res.render('dashboard', data);
        });
      });
    },
    
    queue: function(req, res, next) {
      sab.get('queue', function(error, response, json) {
        return res.send(json);
      });
    }
  }
}