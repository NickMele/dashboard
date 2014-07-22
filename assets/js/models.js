Dashboard.Show = Ember.Object.extend({
  air_by_date: null,
  airs: null,
  cache: {
      banner: null,
      poster: null,
  },
  flatten_folders: null,
  genre: [],
  language: null,
  location: null,
  network: null,
  next_ep_airdate: null,
  paused: null,
  quality: null,
  quality_details: {
      archive: [],
      initial: []
  },
  season_list: [],
  show_name: null,
  status: null,
  tvrage_id: null,
  tvrage_name: null
});

Dashboard.Season = Ember.Object.extend({

});
