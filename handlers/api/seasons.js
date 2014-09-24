var sickbeard = require(process.cwd() + '/helpers/sickbeard');
var sab = require(process.cwd() + '/helpers/sab');
var _ = require('lodash');
var async = require('async');

module.exports = function(app) {
  return {
    // list all the seasons for a show
    index: function(req, res, next) {
      var data = {};
      data.params = {
        tvdbid : parseInt(req.params.tvdbid, 10)
      };
      sickbeard.get('show.seasonlist', data.params, function(error, response, json) {
        data.seasons = json.data;
        return res.send(data);
      });
    },

    // show the episodes for a given season
    show: function(req, res, next) {
      var data = {};
      data.params = {
        tvdbid : parseInt(req.params.tvdbid, 10),
        season : parseInt(req.params.season, 10)
      };
      sickbeard.get('show.seasons', data.params, function(error, response, json) {
        data.episodes = _.map(json.data, function(episode, index) {
          episode.episode_number = index && parseInt(index, 10);
          episode.airdate = new Date(episode.airdate);
          return episode;
        });
        return res.send(data);
      });
    }

  };
};

