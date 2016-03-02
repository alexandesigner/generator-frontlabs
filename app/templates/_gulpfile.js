// ========================================================================== //
//   Global require
// ========================================================================== //
(function (require) {

  // Variables =============== //
  var gulp = require('gulp');
  var watch = require('gulp-watch');<% if (Scss || SASS) { %>
  var sass = require('gulp-sass');<% } %><% if (Less) { %>
  var less = require('gulp-less');
  var path = require('path');<% } %>
  var gutil = require('gulp-util');
  var jshint = require('gulp-jshint');
  var connect = require('gulp-connect');
  var imagemin = require('gulp-imagemin');
  var useref = require('gulp-useref');
  var historyApiFallback = require('connect-history-api-fallback');
  var concat = require('gulp-concat');
  var changed = require('gulp-changed');
  var psi = require('psi');<% if (useAngular) { %>
  var templateCache = require('gulp-angular-templatecache');<% } %>

  // URL Site
  var site = 'http://www.frontlabs.com.br';

  // Assets Paths
  var paths = {
    html:    ['index.html'],<% if (!useAngular) { %>
    scripts: ['app/js/scripts.js'],<% } %><% if (useAngular) { %>
    scripts: ['app/js/controllers/*.js', 'app/js/directives/*.js', 'app/js/filters/*.js', 'app/js/models/*.js', 'app/js/services/*.js', 'app/js/app.js'],<% } %><% if (Scss) { %>
    sass:  ['app/src/scss/**/*.scss'],<% } %><% if (SASS) { %>
    sass:  ['app/src/sass/**/*.sass'],<% } %><% if (Less) { %>
    less:  ['app/src/less/**/*.less'],<% } %><% if ( !SASS || Less || Scss  ) { %>
    styles:  ['app/css/**/*.css'],<% } %>
    scripts: ['app/js/scripts.js'],
    images:  ['app/images/**/*']
  };

  // Connection =============== //
  gulp.task('connect', function() {
    connect.server({
      root: 'app',
      livereload: true,
      port: 8000,
      middleware: function(connect, opt) {
        return [ historyApiFallback({}) ];
      }
    });
  });

  // Stylesheets =============== //
  <% if (!Less) { %>
    gulp.task('styles', function () {<% if (!Less || Scss || SASS) { %>
    return gulp.src(paths.styles)<% } %><% if (Scss || SASS) { %>
    return gulp.src(paths.sass)
      .pipe(sass({outputStyle: 'expanded', errLogToConsole: true}))<% } %>
      .pipe(concat('styles.css'))
      .pipe(gulp.dest('app/css'))
      .pipe(connect.reload());
    });
  <% } %>

  <% if (Less) { %>
    gulp.task('styles', function () {
    return gulp.src(paths.less)
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
      .pipe(concat('styles.css'))
      .pipe(gulp.dest('app/css'))
      .pipe(connect.reload());
  });
<% } %>

  // HTML =============== //
  gulp.task('html', function () {
    return gulp.src(paths.html)
    .pipe(connect.reload());
  });

  // JSHint =============== //
  gulp.task('jshint', function() {
    gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });

  <% if (useAngular) { %>
  // Templates Cache =============== //
  gulp.task('templates', function () {
    return gulp.src('app/js/templates/**/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('app/public'))
  });

  // Public TemplatesCache =============== //
  gulp.task('public', function () {
    return gulp.src('app/public/templates.js')
    .pipe(gulp.dest('build/public'))
  });

  <% } %>

  // Mobile
  gulp.task('psi-mobile', function (cb) {
    psi({
        nokey: 'true',
        url: site,
        strategy: 'mobile',
    }, cb);
  });

  // Desktop
  gulp.task('psi-desktop', function (cb) {
    psi({
        nokey: 'true',
        url: site,
        strategy: 'desktop',
    }, cb);
  });

  // Build Concat/Compile =============== //
  gulp.task('useref', function () {
    return gulp.src(paths.html)
      .pipe(useref())
      .pipe(gulp.dest('app'));
  });

  // Imagemin =============== //
  gulp.task('imagemin', function() {
    var  imgSrc = paths.images,
            imgDst = 'app/images';
    gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
  });

  // Build Fonts =============== //
  gulp.task('fonts', function() {
    gulp.src('app/fonts/**/*.{ttf,woff,eof,svg}')
    .pipe(gulp.dest('build/fonts'));
  });


  // Obseravator =============== //
  gulp.task('watch', function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.styles, ['styles']);
  });

  // Run tasks =============== //
  <% if (!useAngular) { %>gulp.task('default', [ 'html', 'useref', 'imagemin',  'fonts', 'styles', 'watch', 'connect' ]);<% } %><% if (useAngular) { %>
  gulp.task('default', [ 'html', 'public', 'useref', 'fonts', 'imagemin', 'templates', 'styles', 'watch', 'connect' ]);<% } %>

}(require));
