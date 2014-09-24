var express = require('express')
var hbs = require('hbs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var nconf = require('nconf');
var port = process.env.PORT || 3000;

// load config
nconf.file('config/config.json');

// create the express app
var app = express();

// set up static directories
app.use('/dist', express.static(__dirname + '/dist'));

// all environments
app.enable('trust proxy');
app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

// set view engines
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');



// load routes
require('./routes')(app);

// listen on port
app.listen(3000, function() {
  console.info('Dashboard active on port ' + port);
});
