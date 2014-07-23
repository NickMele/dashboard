// Gulpfile.js
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var stylus = require('gulp-stylus');
var nib = require('nib');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var flatten = require('gulp-flatten');
var handlebars = require('gulp-ember-handlebars');

var paths = {
  vendor_scripts: [
   'bower_components/jquery/dist/jquery.min.js',
   'bower_components/handlebars/handlebars.min.js',
   'bower_components/ember/ember.js',
   'bower_components/lodash/dist/lodash.min.js'
  ],
  vendor_styles: [
    'bower_components/font-awesome/css/font-awesome.min.css'
  ],
  fonts: [
    'bower_components/font-awesome/fonts/**/*'
  ],
  styles: ['assets/styles/main.styl'],
  scripts: ['assets/js/lib/*.js','assets/js/*.js'],
  images: ['assets/images/**/*']
};

gulp.task('vendor_scripts', function() {
  return gulp.src(paths.vendor_scripts)
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('vendor_styles', function() {
  return gulp.src(paths.vendor_styles)
    .pipe(concat('vendors.min.css'))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(stylus({use: [nib()]}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    // .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('templates', function() {
  gulp.src(['assets/templates/**/*.hbs'])
    .pipe(handlebars({
      outputType: 'browser'
     }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('fonts', function() {
  gulp.src(paths.fonts)
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(notify({ message: 'fonts built' }));
});

gulp.task('clean', function() {
  return gulp.src(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], {read: false})
    .pipe(clean());
});

gulp.task('server', function () {
  return nodemon({ script: 'server.js', ext: 'hbs js', ignore: ['assets/**/*','ignored.js'] });
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('assets/styles/**/*.styl', ['styles']);

  // Watch .js files
  gulp.watch('assets/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('assets/images/**/*', ['images']);

  // Watch template files
  gulp.watch('assets/templates/**/*', ['templates']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('vendor_scripts', 'vendor_styles', 'fonts', 'styles', 'scripts', 'templates', 'images', 'server', 'watch');
});
