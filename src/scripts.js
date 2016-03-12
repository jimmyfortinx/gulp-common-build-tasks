'use strict';

var $ = require('./utils/plugins-loader');
var tasks = require('./tasks')();
var gulpUtils = require('./utils/gulp');

tasks.create('.jshint', function(gulp, config) {
    var folders = [
        config.paths.src,
        config.paths.e2e
    ];

    return gulp.src(gulpUtils.files(folders, '/**/*.js'))
        .pipe($.jshint(config.jshint))
        .pipe($.jshint.reporter('default'));
});

tasks.create('.jscs', function(gulp, config) {
    var folders = [
        config.paths.src,
        config.paths.e2e
    ];

    return gulp.src(gulpUtils.files(folders, '/**/*.js'))
        .pipe($.jscs())
        .pipe($.jscs.reporter());
});

module.exports = tasks;
