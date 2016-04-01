var gulp = require('gulp');

var babelify = require('babelify');
var browserify = require('browserify');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var react = require('gulp-react');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var less         = require('gulp-less');
var minifyCss    = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var del          = require('del');
var htmlReplace  = require('gulp-html-replace');
var browserSync  = require('browser-sync');


var path = {
  HTML: 'src/index.html',
  HTML_DEST: 'dist',
  JS: ['src/js/*.js', 'src/js/**/*.js', 'src/js/**/**/*.js'],
  JS_ENTRY_POINT: 'src/js/app.js',
  JS_DEST: 'dist/js',
  JS_OUT: 'build.js',
  JS_OUT_MIN: 'build.min.js',
  LESS: ['src/less/*.less', 'src/less/**/*.less', 'src/less/**/**/*.less'],
  LESS_ENTRY_POINT: 'src/less/styles.less',
  CSS_DEST: 'dist/css',
  BOWER: 'bower_components'
};

var onError = function(err) {
  notify.onError({
    title:    "Error",
    message:  "<%= error %>",
  })(err);
  process.exit(1);
};

var plumberOptions = {
  errorHandler: onError,
};

var reloadOptions = {
  stream: true,
};

// Remove compiled CSS files
gulp.task('clean:css', function() {
  del(['dist/css/*', 'dist/css/**/*'], function(err, paths) {
    console.log("Cleaned CSS:\n", paths.join('\n'));
  });
});

// Compile Less to CSS
gulp.task('css', ['clean:css'], function() {

  var autoprefixerOptions = {
    browsers: ['last 2 versions'],
  };

  var lessOptions = {
    includePaths: [
      //'bower_components/bootstrap/less'
    ]
  };

  return gulp.src(path.LESS_ENTRY_POINT)
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(less(lessOptions))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.CSS_DEST))
    .pipe(notify({ message: 'CSS compiled successfuly!' }))
    .pipe(browserSync.reload(reloadOptions));

});

// BrowserSync
gulp.task('browserSync', function() {
  browserSync.init(['css/*.css', 'js/*.js'], {
    server: {
      baseDir: "./dist/"
    },
    open: false,
    notify: true
  });
});

gulp.task('notify', function() {
  browserSync.notify('Live reloading ...');
});

gulp.task('html', function() {
  gulp.src(path.HTML)
    .pipe(htmlReplace({
      'js': '/js/' + path.JS_OUT_MIN
    }))
    .pipe(gulp.dest(path.HTML_DEST))
    .pipe(browserSync.reload(reloadOptions));
});

gulp.task('fonts', function() {
  gulp.src(['src/fonts/*', 'src/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
  gulp.src(['src/img/*', 'src/img/**/*'])
    .pipe(gulp.dest('dist/img'));
});

gulp.task('eslint', function() {
  return gulp.src(path.JS)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel())
    .pipe(react())
    .on('error', function(err) {
      console.error('JSX ERROR in ' + err.fileName);
      console.error(err.message);
      process.exit(1);
    });
});

gulp.task('js', ['eslint'], function() {
  browserify({
    entries: [path.JS_ENTRY_POINT],
    transform: [babelify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true,
    extensions: ['.jsx']
  })
  .bundle()
  .on('error', function(err) {
    console.error("JS Error: \n" + err.message);
  })
  .pipe(source(path.JS_OUT))
  .pipe(gulp.dest(path.JS_DEST))
  .pipe(notify({ message: 'JS compiled successfuly!' }))
  .pipe(browserSync.reload(reloadOptions));
});

gulp.task('watch', function() {

  gulp.watch(path.JS, ['js']);
  gulp.watch(path.LESS, ['css', 'notify']);
  gulp.watch(path.HTML, ['html']);

  /*var watcher = watchify(browserify({
    entries: [path.JS_ENTRY_POINT],
    transform: [babelify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true,
    extensions: ['.jsx']
  }));

  return watcher
    .on('update', function() {
      watcher
        .bundle()
        .on('error', function(err) {
          console.error("JS Error: \n" + err.message);
        })
        .pipe(source(path.JS_OUT))
        .pipe(gulp.dest(path.JS_DEST))
        .pipe(notify({ message: 'JS compiled successfuly!' }))
        .pipe(browserSync.reload(reloadOptions));

      console.log('Updated');
    });*/
});

gulp.task('default', ['build', 'browserSync', 'watch']);
gulp.task('build', ['js', 'css', 'html', 'fonts', 'images']);
