var request = require('request');
var nconf = require('nconf');
var _ = require('lodash');
var sickbeardUrl = nconf.get('sickbeard:url');
var apiKey = nconf.get('sickbeard:key');

// gets combine url
function getApiUrl(params) {
  return sickbeardUrl + apiKey;
}

exports.get = function(command, params, callback) {
  // set args
  if (typeof params !== 'object') {
    callback = params;
    params = {};
  }
  // clone our params
  var qs = _.clone(params);
  // get the url
  var url = getApiUrl();
  // add the command as a param
  qs.cmd = command;
  // create request
  return request({
    url: url,
    qs: qs,
    json: true
  }, callback);
}
