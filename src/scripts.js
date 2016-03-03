'use strict';

var path = require('path');
var _ = require('lodash');
var isThere = require('is-there');

var $ = require('./utils/plugins-loader');
var tasks = require('./tasks')();
var gulpUtils = require('./utils/gulp');

tasks.create('.eslint', function(gulp, config) {
    var folders = [
        config.paths.src,
        config.paths.e2e
    ];

    return gulp.src(gulpUtils.files(folders, '/**/*.js'))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

tasks.create('.jshint', function(gulp, config) {
    var defaultJshintConfig = {
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
    };

    var folders = [
        config.paths.src,
        config.paths.e2e
    ];

    return gulp.src(gulpUtils.files(folders, '/**/*.js'))
        .pipe($.jshint(defaultJshintConfig))
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

tasks.create('.lint', [
    addLinterIfEnabled('eslint'),
    addLinterIfEnabled('jscs'),
    addLinterIfEnabled('jshint')
]);

function addLinterIfEnabled(linterName) {
    var taskName = '.' + linterName;

    return config => {
        if (_.has(config, 'lint.auto')) {
            return hasRootConfigFile(config, linterName) ? taskName : false;
        } else {
            return _.has(config, 'lint.' + linterName) ? taskName : false;
        }
    };
}

function hasRootConfigFile(config, linterName) {
    var linterRootConfigFileName = '.' + linterName + 'rc';
    var linterRootConfigFile = path.join(config.projectDirectory, linterRootConfigFileName);

    return isThere(linterRootConfigFile);
}

module.exports = tasks;
