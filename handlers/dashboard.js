var sickbeard = require('../helpers/sickbeard')
var sab = require('../helpers/sab');
var _ = require('lodash');
var async = require('async');

module.exports = function(app) {
  var useTempData = true;
  
  return {
    index: function(req, res, next) {
      var data = {};
      if (useTempData) {
        require('fs').readFile('./temp/dashboard.json', function(error, data) {
          data = JSON.parse(data);
          if (req.xhr) {
            return res.send(data);
          }
          return res.render('dashboard', data);
        });
      }
      sickbeard.get('shows', { sort: 'name', paused: 0 }, function(error, response, json) {
        data.shows = _.where(json.data, { 'status': 'Continuing' });
        async.each(data.shows, function(show, callback) {
          sickbeard.get('show.seasonlist', { tvdbid: show.tvdbid }, function(error, response, json) {
            var latest_season = _.max(json.data);
            sickbeard.get('show.seasons', { tvdbid: show.tvdbid, season: latest_season }, function(error, response, json) {
              json.data = _.map(json.data, function(episode, key) {
                episode.number = parseInt(key, 10);
                episode.season = latest_season;
                return episode;
              });
              var episodes = json.data.reverse();
              show.latest_season = {
                season: latest_season,
                episodes: _.rest(episodes)
              };
              sickbeard.get('episode', { tvdbid: show.tvdbid, season: latest_season, episode: episodes.length}, function(error, response, json) {
                json.data.number = episodes.length;
                show.latest_episode = json.data;
                return callback();
              });
            });
          });
        }, function(error) {
          // save test object to file
          var saveData = JSON.stringify(data);
          require('fs').writeFile('./temp/dashboard.json', saveData);
          if (req.xhr) {
            return res.send(data);
          }
          return res.render('dashboard', data);
        });
      });
    },
    
    banner: function(req, res, next) {
      // get our request object for the banner
      var banner = sickbeard.get('show.getbanner', { tvdbid: req.params.tvdbid});
      // stream the request to the response
      req.pipe(banner).pipe(res);
    },
    
    poster: function(req, res, next) {
      // get our request object for the poster
      var poster = sickbeard.get('show.getposter', { tvdbid: req.params.tvdbid});
      // stream the request to the response
      req.pipe(poster).pipe(res);
    },
    
    queue: function(req, res, next) {
      sab.get('queue', function(error, response, json) {
        return res.send(json);
      });
    }
  }
}