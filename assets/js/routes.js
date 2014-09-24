Dashboard.Router.map(function() {
  this.route('shows', {path: '/shows'});
  this.resource('show', {path: '/shows/:tvdbid'}, function() {
    this.route('seasons');
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
    return Ember.$.getJSON('/api/shows/' + tvdbid).then(function(data) {
      return Dashboard.Show.create(data.show);
    });
  }
});

Dashboard.ShowSeasonsRoute = Ember.Route.extend({
  model: function(params, transition) {
    var show = this.modelFor('show');
    var tvdbid = show.get('tvdbid');
    return Ember.$.getJSON('/api/shows/' + tvdbid + '/seasons').then(function(data) {
      return data.seasons.map(function(season) {
        return Dashboard.Season.create(season);
      });
    });
  }
});
