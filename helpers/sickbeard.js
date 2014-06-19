var request = require('request')
  , nconf = require('nconf')
  , _ = require('lodash')
  , sickbeardUrl = nconf.get('sickbeard:url')
  , apiKey = nconf.get('sickbeard:key');
  
// gets combine url
function getApiUrl(params) {
  return sickbeardUrl + apiKey;
}
  
exports.get = function(command, params, callback) {
  // set args
  if (typeof params !== 'object') {
    callback = params
    params = {}
  }
  // get the url
  var url = getApiUrl();
  // add the command as a param
  params.cmd = command;
  // create request
  request({
    url: url,
    qs: params,
    json: true
  }, callback);
}