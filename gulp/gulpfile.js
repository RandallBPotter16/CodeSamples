'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');

var paths = {
    sass: ['./scss/**/*.scss', './www/scss/**/*.scss'],
    js: ['./js/*.js', './js/**/*.js']
};

gulp.task('default', function (callback) {
    runSequence(['concatjs', 'sass'],
        'update',
        'install',
        'lint',
        'test',
        callback);
});

gulp.task('concatjs', function () {
    return gulp.src(paths.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./www/js/'));
});

gulp.task('sass', function (done) {
    gulp.src('./scss/discovery.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('lint', function () {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['concatjs']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('update', ['git-check'], function () {
    return bower.commands.update()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
