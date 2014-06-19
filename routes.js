module.exports = function(app) {
  
  // load handlers
  var dashboard = require('./handlers/dashboard')(app);
  
  // setup routes
  app.get('/', dashboard.index);
  
};