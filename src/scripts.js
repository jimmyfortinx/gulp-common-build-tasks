'use strict';

var path = require('path');
var _ = require('lodash');

var $ = require('./utils/plugins-loader');

exports.jshint = function(config, gulp) {
    return gulp.src(path.join(config.paths.src, '/**/*.js'))
        .pipe($.jshint(config.jshint))
        .pipe($.jshint.reporter('default'));
};

exports.addDefaultJsHintConfig = function(config) {
    var defaultConfig = {
        jshint: {
            node: true,
            globals: {
                /* jasmine */
                'describe': false,
                'xdescribe': false,
                'fdescribe': false,
                'it': false,
                'xit': false,
                'fit': false,
                'before': false,
                'beforeEach': false,
                'after': false,
                'afterEach': false,
                'jasmine': false,
                'expect': false
            }
        }
    };

    _.merge(config, defaultConfig);
};

exports.jscs = function(config, gulp) {
    return gulp.src(path.join(config.paths.src, '/**/*.js'))
        .pipe($.jscs())
        .pipe($.jscs.reporter());
};
