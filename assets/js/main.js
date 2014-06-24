(function(window, $, _) {
  
  // master object
  var dashboard = window.dashboard = {};
  
  // modules object
  dashboard.modules = {};
  
  // object that stores all instances of created objects.
  // allows you to access/modify each unique object.
  dashboard.objects = {};

  // namespace for any adhoc functions
  dashboard.functions = {};
  
  // object of various properties accessed across different methods
  dashboard.properties = {};
  
  // shortcut to modules
  window.dash = dashboard.modules;
  
  /* Shows
  -------------------------------------------------------------------------- */
  dashboard.modules.show = function(selector) {

    var Show = function(el) {

      // cache element
      this.$element = $(el);

      // options object
      this.options = {};
      
      this.tvdbid = this.$element.data('tvdbid');
      
      this.listeners = function() {
        var self = this;
        
      };

      // initialization controller
      this.init = function(index) {
        var self = this;

        // return if already instantiated
        if ( self.$element.data('instantiated') ) { return; }
        
        self.listeners();

        // store data
        self.$element.data({
            instantiated: true,
            instance: index
        });

        self.$element.trigger('ready');
      };

    };

    // public methods
    return {
      // initial initialization
      init: function() {

        // get selector if passed in
        var _selector = selector || '.show';
        
        // init objects
        if ( typeof dashboard.objects.shows === 'undefined' ) { dashboard.objects.shows = []; }

        // instantiate
        $(_selector, document).each(function(i, el){

          var newShow = new Show(el);
          newShow.init(i);

          dashboard.objects.shows.push(newShow);

        });

      }
    };

  };
  
  /* Episodes
  -------------------------------------------------------------------------- */
  dashboard.modules.episode_list = function(selector) {
    
    var Episode = function(el, data) {
      
      // cache element
      this.$element = $(el);
      
      this.data = $.extend({}, data);
      
      this.listeners = function() {
        var self = this;
        
        self.$element.find('.search').on('click', function() {
          console.log(self.data, $(this).closest('li').data('episode'));
        })
      }
      
      this.init = function(index) {
        var self = this;
        
        // return if already instantiated
        if ( self.$element.data('instantiated') ) { return; }
        
        self.listeners();
        
        // store data
        self.$element.data({
            instantiated: true,
            instance: index
        });

        self.$element.trigger('ready');
      };
      
    };

    var EpisodeList = function(el) {

      // cache element
      this.$element = $(el);

      // options object
      this.options = {};
      
      this.data = {
        tvdbid: this.$element.data('tvdbid'),
        season: this.$element.data('season')
      }
      
      this.episodes = [];
      
      // initialization controller
      this.init = function(index) {
        var self = this;

        // return if already instantiated
        if ( self.$element.data('instantiated') ) { return; }
        
        // instantiate each episode
        self.$element.find('li').each(function(i, el){

          var newEpisode = new Episode(el, self.data);
          newEpisode.init(i);

          self.episodes.push(newEpisode);

        });

        // store data
        self.$element.data({
            instantiated: true,
            instance: index
        });

        self.$element.trigger('ready');
      };

    };

    // public methods
    return {
      // initial initialization
      init: function() {

        // get selector if passed in
        var _selector = selector || '.episode-list';
        
        // init objects
        if ( typeof dashboard.objects.episode_lists === 'undefined' ) { dashboard.objects.episode_lists = []; }

        // instantiate
        $(_selector, document).each(function(i, el){

          var newEpisodeList = new EpisodeList(el);
          newEpisodeList.init(i);

          dashboard.objects.episode_lists.push(newEpisodeList);

        });

      }
    };

  };
  
  /* --------------------------------------------------------------------------
  |   -- Initializer --
  -------------------------------------------------------------------------- */
  $(window).on('load.dashboard', function(){

      // broadcast that the core properties have been provisioned
      $(window).trigger('dashboard.primed');

      // init each modules
      $.each(dashboard.modules, function(){
          this().init();
      });

      $(window).trigger('dashboard.modules');
      $(window).trigger('dashboard.ready');

  });
  
})(window, $, _);