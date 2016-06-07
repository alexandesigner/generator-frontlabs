(function (require) {

  var gulp = require('gulp');
  var watch = require('gulp-watch');<% if (Scss || SASS) { %>
  var sass = require('gulp-sass');<% } %><% if (Less) { %>
  var less = require('gulp-less');
  var path = require('path');<% } %><% if (Stylus) { %>
  var stylus = require('gulp-stylus');<% } %>
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

  var site = 'http://www.frontlabs.com.br';

  var paths = {
    html:     ['index.html'],<% if (!useAngular) { %>
    scripts:  ['app/js/scripts.js'],<% } %><% if (useAngular) { %>
    angular:  ['app/js/controllers/*.js', 'app/js/directives/*.js', 'app/js/filters/*.js', 'app/js/models/*.js', 'app/js/services/*.js', 'app/js/app.js'],<% } %><% if (SASS) { %>
    sass:     ['app/src/sass/**/*.sass'],<% } %><% if (Scss) { %>
    scss:     ['app/src/scss/**/*.scss'],<% } %><% if (Stylus) { %>
    stylus:   ['app/src/stylus/**/*.styl'],<% } %><% if (Less) { %>
    less:     ['app/src/less/**/*.less'],<% } %><% if ( !SASS && !Less && !Scss && !Stylus ) { %>
    styles:   ['app/css/**/*.css'],<% } %>
    images:   ['app/images/**/*']
  };

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

  <% if (!SASS && !Less && !Scss && !Stylus) { %>
    gulp.task('styles', function () {
    return gulp.src(paths.styles)
      .pipe(connect.reload());
    });
  <% } %>
  <% if (SASS || Scss) { %>
    gulp.task('styles', function () {<% if (Scss) { %>
    return gulp.src(paths.scss)<% } %><% if (SASS) { %>
    return gulp.src(paths.sass)<% } %>
      .pipe(sass({outputStyle: 'expanded', errLogToConsole: true}))
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
<% if (Stylus) { %>
    gulp.task('styles', function () {
    return gulp.src(paths.stylus)
      .pipe(stylus())
      .pipe(concat('styles.css'))
      .pipe(gulp.dest('app/css'))
      .pipe(connect.reload());
  });
<% } %>

  gulp.task('html', function () {
    return gulp.src(paths.html)
    .pipe(connect.reload());
  });

  gulp.task('jshint', function() {
    gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });

  <% if (useAngular) { %>
  gulp.task('templates', function () {
    return gulp.src('app/js/templates/**/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('app/public'))
  });

  gulp.task('public', function () {
    return gulp.src('app/public/templates.js')
    .pipe(gulp.dest('build/public'))
  });

  <% } %>

  gulp.task('psi-mobile', function (cb) {
    psi({
        nokey: 'true',
        url: site,
        strategy: 'mobile',
    }, cb);
  });

  gulp.task('psi-desktop', function (cb) {
    psi({
        nokey: 'true',
        url: site,
        strategy: 'desktop',
    }, cb);
  });

  gulp.task('useref', function () {
    return gulp.src(paths.html)
      .pipe(useref())
      .pipe(gulp.dest('app'));
  });

  gulp.task('imagemin', function() {
    var  imgSrc = paths.images,
            imgDst = 'app/images';
    gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
  });

  gulp.task('watch', function() {
    gulp.watch(paths.html, ['html']);<% if (Scss) { %>
    gulp.watch(paths.scss, ['styles']);<% } %><% if (SASS) { %>
    gulp.watch(paths.sass, ['styles']);<% } %><% if (Stylus) { %>
    gulp.watch(paths.stylus, ['styles']);<% } %><% if (Less) { %>
    gulp.watch(paths.less, ['styles']);<% } %><% if ( !SASS && !Less && !Scss && !Stylus ) { %>
    gulp.watch(paths.styles, ['styles']);<% } %>
  });

  <% if (!useAngular) { %>gulp.task('default', [ 'html', 'useref', 'imagemin',  'styles', 'watch', 'connect' ]);<% } %><% if (useAngular) { %>
  gulp.task('default', [ 'html', 'public', 'useref', 'imagemin', 'templates', 'styles', 'watch', 'connect' ]);<% } %>

}(require));
