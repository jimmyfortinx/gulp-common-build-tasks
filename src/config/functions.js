'use strict';

var path = require('path');
var isThere = require('is-there');
var _ = require('lodash');

var hasJSHintCache;
var hasJSCSCache;

exports.getProjectDirectory = function(userConfig) {
    // This parameter is useful only when npm link is used
    if (_.has(userConfig, 'projectDirectory')) {
        return userConfig.projectDirectory;
    } else {
        return path.join(__dirname, '../../../..');
    }
};

exports.hasJSHintFile = function(projectDirectory) {
    if (hasJSHintCache === undefined) {
        hasJSHintCache = isThere(path.join(projectDirectory, '.jshintrc'));
    }

    return hasJSHintCache;
};

exports.hasJSCSFile = function(projectDirectory) {
    if (hasJSCSCache === undefined) {
        hasJSCSCache = isThere(path.join(projectDirectory, '.jscsrc'));
    }

    return hasJSCSCache;
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
                'beforeAll': false,
                'after': false,
                'afterEach': false,
                'afterAll': false,
                'jasmine': false,
                'expect': false
            }
        }
    };

    _.merge(config, defaultConfig);
};
