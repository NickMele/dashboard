var request = require('request')
  , nconf = require('nconf')
  , _ = require('lodash')
  , sabUrl = nconf.get('sabnzbd:url')
  , apiKey = nconf.get('sabnzbd:key');
  
// gets combine url
function getApiUrl(params) {
  return sabUrl + '?apikey=' + apiKey;
}
  
exports.get = function(mode, params, callback) {
  // set args
  if (typeof params !== 'object') {
    callback = params
    params = {}
  }
  // get the url
  var url = getApiUrl();
  // set output type
  params.output = 'json';
  // add the mode as a param
  params.mode = mode;
  // create request
  request({
    url: url,
    qs: params,
    json: true
  }, callback);
}