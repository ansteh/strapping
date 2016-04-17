var fs          = require('fs');
var path        = require('path');
var gulp        = require('gulp');
var del         = require('del');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var ejs         = require("gulp-ejs");
var htmlmin     = require('gulp-htmlmin');
var cssmin      = require('gulp-cssmin');
var rename      = require('gulp-rename');
var gutil       = require('gulp-util');
var ftp         = require('gulp-ftp');
var jsonMinify  = require('gulp-json-minify');

gulp.task('clean', function(cb) {
  var dist = path.resolve('site/dist');
  del(['site/dist/client', 'site/dist/npm', 'site/dist/muse', 'site/dist/index.html']).then(function(paths){
    console.log('Deleted files and folders:\n', paths.join('\n'));
    cb();
  });
});

gulp.task('css', ['clean'], function(cb) {
  var source = path.resolve('site/src/**/*.css');
  var dist   = path.resolve('site/dist/');
  return gulp.src(source)
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dist));
});

gulp.task('js', ['clean'], function(cb) {
  var source = path.resolve('site/src/**/*.js');
  var dist   = path.resolve('site/dist/');
  return gulp.src(source)
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dist));
});

gulp.task('produce', ['clean', 'js', 'css', 'charts'], function(cb) {
  var source = ['site/src/**/*.ejs', '!site/src/**/*.tpl.ejs', '!site/src/youtube/**/*'];
  var dist   = path.resolve('site/dist/');
  return gulp.src(source)
    .pipe(ejs({site: 'wiquation.net'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dist));
});

gulp.task('development', ['produce'], function(){
  gulp.watch([['site/src/**/*']], ['produce']);
});

gulp.task('deploy', ['produce'], function(){
  var options = require('./site/ftp-config.js');
  options.pass = options.password;
  var source = path.resolve('site/dist/**/*');
  return gulp.src(source)
		.pipe(ftp(options))
		.pipe(gutil.noop());
});

gulp.task('json', function() {
  return gulp.src('server/pages/metrics/resources/fake_users1.json')
    .pipe(jsonMinify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('resources/'));
});

gulp.task('cleanCharts', function(cb) {
  var dist = path.resolve('site/dist/youtube/charts');
  del([dist]).then(function(){ cb(); });
});

gulp.task('charts', ['cleanCharts'], function(){
  var Channels = require('./server/pages/metrics/server/channels/service.js');

  var source = ['site/src/youtube/charts/**/*.ejs', '!site/src/youtube/charts/**/*.tpl.ejs'];
  var dist   = path.resolve('site/dist/youtube/charts/');
  return gulp.src(source)
    .pipe(ejs({
      site: 'wiquation.net',
      charts: Channels.charts('views'),
      percent: function(present, past){
        return parseInt((present/past-1)*100);
      }
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dist));
});

gulp.task('default', ['development']);
