Dashboard.ShowController = Ember.ObjectController.extend({
  currentSeason: null,

  poster: function() {
    return '/api/shows/' + this.get('tvdbid') + '/poster';
  }.property('tvdbid'),

  banner: function() {
    return '/api/shows/' + this.get('tvdbid') + '/banner';
  }.property('tvdbid')

});

Dashboard.SeasonsSeasonController = Ember.ObjectController.extend({

  title: function() {
    var season_number = this.get('season_number');
    if (season_number === 0) {
      return "Specials";
    } else {
      return "Season " + season_number;
    }
  }.property('season_number')

});

Dashboard.EpisodeController = Ember.ObjectController.extend({
  needs: ['show', 'seasons'],

  season_number: Ember.computed.alias('parentController.season_number'),
  tvdbid: Ember.computed.alias('controllers.show.tvdbid'),
  searching: false,

  statusLowercase: function() {
    var status = this.get('status');
    return status && status.toLowerCase();
  }.property('status'),

  init: function() {
    var controller = this;
    var status = controller.get('status');
    if (status && status.toLowerCase() === "snatched") {
      controller.send('refresh');
    }
  },

  actions: {
    refresh: function() {
      var controller = this;
      var tvdbid = this.get('tvdbid');
      var season_number = this.get('season_number');
      var episode_number = this.get('episode_number');
      Ember.$.ajax({
        url: '/api/shows/' + tvdbid + '/seasons/' + season_number + '/episodes/' + episode_number,
        type: 'GET'
      }).done(function(data) {
        var episode = data && data.episode;
        if (episode) {
          controller.set('model', episode);
        }
      });
    },
    download: function() {
      var controller = this;
      controller.set('searching', true);
      Ember.$.ajax({
        url: '/api/search',
        type: 'GET',
        data: {
          tvdbid: controller.get('tvdbid'),
          episode: controller.get('episode_number'),
          season: controller.get('season_number')
        }
      }).done(function(data) {
        console.log(data);
        alert('Episode snatched?');
        controller.send('refresh');
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR,textStatus,errorThrown);
        alert('Could not search for episode');
      }).always(function() {
        controller.set('searching', false);
      });
    }
  }
});
