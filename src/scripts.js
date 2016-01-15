'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

exports.jshint = function(config, gulp) {
    return gulp.src(path.join(config.paths.src, '/**/*.js'))
        .pipe($.jshint(config.jshint))
        .pipe($.jshint.reporter('default'));
};

exports.jscs = function(config, gulp) {
    return gulp.src(path.join(config.paths.src, '/**/*.js'))
        .pipe($.jscs())
        .pipe($.jscs.reporter());
};
