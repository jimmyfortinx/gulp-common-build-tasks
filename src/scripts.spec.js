describe('scripts', function() {
    var scripts;

    beforeEach(function() {
        scripts = require('./scripts');
    });

    describe('addDefaultJsHintConfig', function() {
        it('adds the default config to an empty config file', function() {
            var config = {};

            scripts.addDefaultJsHintConfig(config);

            expect(config.jshint.globals).toBeTruthy();
        });

        it('adds the default config to an existing config file', function() {
            var config = {
                jshint: {
                    test: 'testValue'
                }
            };

            scripts.addDefaultJsHintConfig(config);

            expect(config.jshint.globals).toBeTruthy();
            expect(config.jshint.test).toEqual('testValue');
        });
    });
});
