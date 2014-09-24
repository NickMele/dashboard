var sickbeard = require(process.cwd() + '/helpers/sickbeard');
var sab = require(process.cwd() + '/helpers/sab');
var _ = require('lodash');
var async = require('async');

function getEpisode(req, res) {
  return function(next) {
    var data = {};
    data.params = {
      tvdbid: parseInt(req.params.tvdbid, 10),
      season: parseInt(req.params.season, 10),
      episode: parseInt(req.params.episode, 10)
    };
    sickbeard.get('episode', data.params, function(error, response, episode) {
      data.episode = episode.data;
      return next(null, data);
    });
  };
}

function getHistory(req, res) {
  return function(data, next) {
    sickbeard.get('history', function(error, response, history) {
      data.history = _.where(history.data, data.params);
      return next(null, data);
    });
  };
}

function getDownloadStatus(req, res) {
  return function(data, next) {
    sab.get('queue', function(error, response, queue) {
      var grouped_queue = _.groupBy(queue.queue.slots, 'cat');
      var tv_downloads = grouped_queue && grouped_queue.tv;
      var download_status = _.map(data.history, function(item) {
        return _.find(tv_downloads, { filename: item.resource });
      });
      data.episode.download_status = _.chain(download_status).compact().uniq('filename').value();
      return next(null, data);
    });
  };
}

module.exports = function(app) {
  return {
    show: function(req, res, next) {
      var steps = [
        getEpisode(req, res),
        getHistory(req, res),
        getDownloadStatus(req, res)
      ];
      async.waterfall(steps, function(error, data) {
        return res.send(data);
      });
    }
  };
};

