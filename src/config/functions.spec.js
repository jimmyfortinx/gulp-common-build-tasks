var proxyquire =  require('proxyquire');
var isThereSpy;
var path = require('path');
var functions;

describe('functions', function() {
    beforeEach(function() {
        isThereSpy = jasmine.createSpy('IsThere').and.returnValue(true);

        functions = proxyquire('./functions', {
            'is-there': isThereSpy
        });
    });

    describe('addDefaultJsHintConfig', function() {
        it('adds the default config to an empty config file', function() {
            var configJson = {};

            functions.addDefaultJsHintConfig(configJson);

            expect(configJson.jshint.globals).toBeTruthy();
        });

        it('adds the default config to an existing config file', function() {
            var configJson = {
                jshint: {
                    test: 'testValue'
                }
            };

            functions.addDefaultJsHintConfig(configJson);

            expect(configJson.jshint.globals).toBeTruthy();
            expect(configJson.jshint.test).toEqual('testValue');
        });
    });

    describe('hasJSHintFile', function() {
        it('check for the right filename', function() {
            functions.hasJSHintFile('aDirectory/far');

            expect(isThereSpy).toHaveBeenCalledWith(path.normalize('aDirectory/far/.jshintrc'));
        });

        it('is cached', function() {
            functions.hasJSHintFile('aDirectory/far');
            functions.hasJSHintFile('aDirectory/far');

            expect(isThereSpy.calls.count()).toEqual(1);
        });
    });

    describe('hasJSCSFile', function() {
        it('check for the right filename', function() {
            functions.hasJSCSFile('aDirectory/far');

            expect(isThereSpy).toHaveBeenCalledWith(path.normalize('aDirectory/far/.jscsrc'));
        });

        it('is cached', function() {
            functions.hasJSCSFile('aDirectory/far');
            functions.hasJSCSFile('aDirectory/far');

            expect(isThereSpy.calls.count()).toEqual(1);
        });
    });
});
