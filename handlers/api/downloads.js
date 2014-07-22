var sickbeard = require(process.cwd() + '/helpers/sickbeard');
var sab = require(process.cwd() + '/helpers/sab');
var _ = require('lodash');
var async = require('async');

module.exports = function(app) {
  return {
    queue: function(req, res, next) {
      var data = {};
      sab.get('queue', function(error, response, json) {
        data.queue = _.groupBy(json.queue.slots, function(slot) {
          return slot.cat;
        });
        return res.send(data);
      });
    }
  };
};

