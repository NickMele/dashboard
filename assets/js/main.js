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
  dashboard.properties = {
    urls: {
      episode: {
        search: '/api/show/episode.search'
      }
    }
  };
  
  // shortcut to modules
  window.dash = dashboard.modules;
  
  /* Shows
  -------------------------------------------------------------------------- */
  dashboard.modules.show = function(selector) {

    var Show = function(el) {
      
      var obj = this;

      // cache element
      this.$element = $(el);

      // options object
      this.options = {};
      
      this.tvdbid = this.$element.data('tvdbid');
      
      this.listeners = function() {
        obj.$element.find('.show-banner').on('click', function() {
          obj.$element.toggleClass('open');
        });
      };

      // initialization controller
      this.init = function(index) {
        
        // return if already instantiated
        if ( obj.$element.data('instantiated') ) { return; }
        
        obj.listeners();

        // store data
        obj.$element.data({
            instantiated: true,
            instance: index
        });

        obj.$element.trigger('ready');
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
    
    var Episode = function(el) {
      
      var obj = this;
      
      // cache element
      this.$element = $(el);
      
      // cache elements
      this.elements = {
        $search: this.$element.find('.search'),
        $status: this.$element.find('.status')
      }
      
      this.cache = {
        original_status: this.$element.data('status')
      }
      
      // data object
      this.data = {
        tvdbid: null,
        season: null,
        episode: this.$element.data('episode')
      };
      
      this.setStatus = function(status) {
        // set episode status
        obj.$element.attr('data-status', status);
        // set status text
        obj.elements.$status.text(status);
      };
      
      this.searchCompleted = function() {
        // set status
        obj.setStatus('snatched');
      };
      
      this.searchFailed = function() {
        // set status
        obj.setStatus(obj.cache.original_status);
      };
      
      // initiates a sickbeard search for this episode
      this.search = function() {
        // set status to searching
        obj.setStatus('searching');
        // initiate api request
        $.ajax({
          url: dashboard.properties.urls.episode.search,
          data: obj.data
        }).then(
          obj.searchCompleted,
          obj.searchFailed
        );
      };
      
      this.listeners = function() {
        // initiate search when search icon is clicked
        obj.elements.$search.on('click', function() {
          obj.search();
        });
      };
      
      this.init = function(index, data) {
        
        // return if already instantiated
        if ( obj.$element.data('instantiated') ) { return; }
        
        // merge data
        obj.data = $.extend({}, obj.data, data);
        
        obj.listeners();
        
        // store data
        obj.$element.data({
          instantiated: true,
          instance: index
        });

        obj.$element.trigger('ready');
      };
      
    };

    var EpisodeList = function(el) {
      
      var obj = this;

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
        
        // return if already instantiated
        if ( obj.$element.data('instantiated') ) { return; }
        
        // instantiate each episode
        obj.$element.find('li').each(function(i, el){

          var newEpisode = new Episode(el);
          newEpisode.init(i, obj.data);

          obj.episodes.push(newEpisode);

        });

        // store data
        obj.$element.data({
            instantiated: true,
            instance: index
        });

        obj.$element.trigger('ready');
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