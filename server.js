var express = require('express')
var namespace = require('express-namespace');
var app = express();
var nconf = require('nconf');
var hbs = require('hbs');

// handlebars helpers
hbs.registerHelper('lowercase', function(string) {
  return string && string.toLowerCase();
});
  
// load config
nconf.file('config/config.json');

// set view engines
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// set up static directories
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.enable('trust proxy');

// load routes
require('./routes')(app);

// listen on port
app.listen(3000);