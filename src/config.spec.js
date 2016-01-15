var proxyquire =  require('proxyquire');
var isThereSpy;
var path = require('path');
var config;

describe('config', function() {
    beforeEach(function() {
        isThereSpy = jasmine.createSpy('IsThere').and.returnValue(true);

        config = proxyquire('./config', {
            'is-there': isThereSpy
        });
    });

    describe('addDefaultJsHintConfig', function() {
        it('adds the default config to an empty config file', function() {
            var configJson = {};

            config.addDefaultJsHintConfig(configJson);

            expect(configJson.jshint.globals).toBeTruthy();
        });

        it('adds the default config to an existing config file', function() {
            var configJson = {
                jshint: {
                    test: 'testValue'
                }
            };

            config.addDefaultJsHintConfig(configJson);

            expect(configJson.jshint.globals).toBeTruthy();
            expect(configJson.jshint.test).toEqual('testValue');
        });
    });

    describe('hasJSHintFile', function() {
        it('check for the right filename', function() {
            config.hasJSHintFile('aDirectory/far');

            expect(isThereSpy).toHaveBeenCalledWith(path.normalize('aDirectory/far/.jshintrc'));
        });

        it('is cached', function() {
            config.hasJSHintFile('aDirectory/far');
            config.hasJSHintFile('aDirectory/far');

            expect(isThereSpy.calls.count()).toEqual(1);
        });
    });

    describe('hasJSCSFile', function() {
        it('check for the right filename', function() {
            config.hasJSCSFile('aDirectory/far');

            expect(isThereSpy).toHaveBeenCalledWith(path.normalize('aDirectory/far/.jscsrc'));
        });

        it('is cached', function() {
            config.hasJSCSFile('aDirectory/far');
            config.hasJSCSFile('aDirectory/far');

            expect(isThereSpy.calls.count()).toEqual(1);
        });
    });
});
