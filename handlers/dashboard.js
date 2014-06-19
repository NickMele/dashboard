var sickbeard = require('../helpers/sickbeard')
  , _ = require('lodash')
  , async = require('async');

module.exports = function(app) {
  return {
    index: function(req, res, next) {
      async.parallel({
        future: function(callback) {
          sickbeard.get('future', { type: 'later' }, function(error, response, json) {
            callback(null, json);
          });
        },
        history: function(callback) {
          sickbeard.get('history', function(error, response, json) {
            callback(null, json);
          });
        }
      }, function(error, results) {
        _.forEach(results.future.data.later, function(show) {
          show.history = _.where(results.history.data, { 'tvdbid': show.tvdbid, episode: show.episode });
        });
        res.send(results);
      });
    }
  }
}