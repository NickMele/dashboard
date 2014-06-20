var express = require('express')
  , app = express()
  , nconf = require('nconf');
  
// load config
nconf.file('config/config.json');

// set view engines
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// set up static directories
app.use('/dist', express.static(__dirname + '/dist'));

app.enable('trust proxy');

// load routes
require('./routes')(app);

// listen on port
app.listen(3000);