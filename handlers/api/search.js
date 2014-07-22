var sickbeard = require(process.cwd() + '/helpers/sickbeard');
var sab = require(process.cwd() + '/helpers/sab');
var _ = require('lodash');
var async = require('async');

module.exports = function(app) {
  return {
    episode: function(req, res, next) {
      var params = {
        tvdbid: req.query.tvdbid,
        season: req.query.season,
        episode: req.query.episode
      };
      sickbeard.get('episode.search', params, function(error, response, json) {
        return res.send(json);
      });
    }
  };
};
