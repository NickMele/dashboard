var sickbeard = require(process.cwd() + '/helpers/sickbeard');
var sab = require(process.cwd() + '/helpers/sab');
var _ = require('lodash');
var async = require('async');

function getShow(req, res) {
  return function(next) {
    var data = {};
    sickbeard.get('show', { tvdbid: req.params.tvdbid }, function(error, response, json) {
      data.show = json.data;
      data.show.tvdbid = parseInt(req.params.tvdbid, 10);
      return next(null, data);
    });
  };
}

function getShowSeasons(req, res) {
  return function(data, next) {
    sickbeard.get('show.seasons', { tvdbid: req.params.tvdbid }, function(error, response, json) {
      data.seasons = _.map(json.data, function(season, key) {
        return {
          season_number: key && parseInt(key, 10),
          episodes: _.map(season, function(episode, index) {
            episode.episode_number = index && parseInt(index, 10);
            return episode;
          })
        };
      }).reverse();
      return next(null, data);
    });
  };
}

function getShowDownloads(req, res) {
  return function(data, next) {
    sab.get('queue', function(error, response, json) {
      var queue = _.groupBy(json.queue.slots, 'cat');
      queue = queue && queue.tv;
      data.downloads = queue;
      return next(null, data);
    });
  };
}

module.exports = function(app) {
  return {
    index: function(req, res) {
      var data = {};
      sickbeard.get('shows', { sort: 'name', paused: 0 }, function(error, response, json) {
        // get only continuing shows
        data.shows = _.toArray(json.data);
        return res.send(data);
      });
    },

    show: function(req, res) {
      var steps = [
        getShow(req, res),
        getShowSeasons(req, res),
        getShowDownloads(req, res)
      ];
      async.waterfall(steps, function(error, data) {
        return res.send(data);
      });
    }

  };
};
