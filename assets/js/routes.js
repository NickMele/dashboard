Dashboard.Router.map(function() {
  this.resource('shows', {path: '/'}, function() {
    this.resource('show', {path: '/show/:tvdbid'}, function() {
    });
  });
});

// Shows Route: '/'
Dashboard.ShowsRoute = Ember.Route.extend({
  model: function() {
    var shows = Ember.A();
    return Ember.$.getJSON('/api/shows').then(function(data) {
      data.shows.forEach(function(show) {
        shows.pushObject(Dashboard.Show.create(show));
      });
      return shows;
    });
  }
});

// Show Route - Lists Projects
Dashboard.ShowRoute = Ember.Route.extend({
  model: function(params) {
    var tvdbid = params.tvdbid && parseInt(params.tvdbid, 10);
    var show = this.modelFor('shows').findBy('tvdbid', tvdbid);
    var seasons = Ember.A();
    return Ember.$.getJSON('/api/shows/' + tvdbid).then(function(data) {
      data.seasons.forEach(function(season) {
        seasons.pushObject(Dashboard.Season.create(season));
      });
      return {
        show: Dashboard.Show.create(data.show),
        seasons: seasons
      };
    });
  }
});
