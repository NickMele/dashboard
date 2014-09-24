module.exports = function(app) {
  return {
    shows: require('./shows')(app),
    seasons: require('./seasons')(app),
    episodes: require('./episodes')(app),
    search: require('./search')(app),
    downloads: require('./downloads')(app)
  };
};
