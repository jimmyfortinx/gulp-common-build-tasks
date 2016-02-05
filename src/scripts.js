'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');
var tasks = require('./tasks')();

tasks.create('.jshint', function(gulp, config) {
    return gulp.src(path.join(config.paths.src, '/**/*.js'))
        .pipe($.jshint(config.jshint))
        .pipe($.jshint.reporter('default'));
});

tasks.create('.jscs', function(gulp, config) {
    return gulp.src(path.join(config.paths.src, '/**/*.js'))
        .pipe($.jscs())
        .pipe($.jscs.reporter());
});

module.exports = tasks;
