Dashboard.Router.map(function() {
  this.route('shows', { path: '/shows' });
  this.resource('show', { path: '/shows/:tvdbid' }, function() {
    this.resource('seasons', function() {
      this.route('season', { path: '/:season' });
    });
  });
});

Dashboard.Router.reopen({
  location: 'history'
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
  },

  actions: {
    setCurrentSeason: function(season) {
      if (!season) return;
      this.controller.set('currentSeason', season);
    }
  }
});

Dashboard.SeasonsRoute = Ember.Route.extend({
  model: function(params, transition) {
    var show = this.modelFor('show');
    var tvdbid = show.get('tvdbid');
    return Ember.$.getJSON('/api/shows/' + tvdbid + '/seasons').then(function(data) {
      return data.seasons.map(function(season) {
        return Dashboard.Season.create(season);
      });
    });
  },
  afterModel: function(seasons, transition) {
    if (seasons.get('length') > 0 && !transition.params['seasons.season']) {
      this.transitionTo('seasons.season', seasons.get('firstObject.season_number'));
    }
  }
});

Dashboard.SeasonsSeasonRoute = Ember.Route.extend({
  model: function(params) {
    var show = this.modelFor('show');
    var tvdbid = show.get('tvdbid');
    var season = params.season;
    return Ember.$.getJSON('/api/shows/' + tvdbid + '/seasons/' + season).then(function(data) {
      return Dashboard.Season.create(data.season);
    });
  }
});
