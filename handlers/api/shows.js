var sickbeard = require(process.cwd() + '/helpers/sickbeard');
var sab = require(process.cwd() + '/helpers/sab');
var _ = require('lodash');
var async = require('async');

function getShowDownloads(req, res, next) {
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
    // list all the shows
    index: function(req, res, next) {
      var data = {};
      sickbeard.get('shows', { sort: 'name', paused: 0 }, function(error, response, json) {
        // get only continuing shows
        data.shows = _.toArray(json.data);
        return res.send(data);
      });
    },

    // show the details of the given show
    show: function(req, res, next) {
      var data = {};
      sickbeard.get('show', { tvdbid: req.params.tvdbid }, function(error, response, json) {
        data.show = json.data;
        data.show.tvdbid = parseInt(req.params.tvdbid, 10);
        return res.send(data);
      });
    },

    // show the poster for a show
    poster: function(req, res, next) {
      // get our request object for the poster
      var poster = sickbeard.get('show.getposter', { tvdbid: req.params.tvdbid });
      // stream the request to the response
      req.pipe(poster).pipe(res);
    },

    // show the banner for a show
    banner: function(req, res, next) {
      // get our request object for the banner
      var banner = sickbeard.get('show.getbanner', { tvdbid: req.params.tvdbid });
      // stream the request to the response
      req.pipe(banner).pipe(res);
    }

  };
};
