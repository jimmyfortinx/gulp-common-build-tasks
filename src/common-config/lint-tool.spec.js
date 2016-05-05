var lintTool = require('./lint-tool');

describe('functions', function() {
    describe('apply', function() {
        it('sets auto as default lint tool', function() {
            var newConfig = {};

            lintTool.apply(newConfig);

            expect(newConfig.lint.auto).toBe(true);
        });

        it('sets jshint if defined by user', function() {
            var newConfig = {};

            var userConfig = {
                lint: 'jshint'
            };

            lintTool.apply(newConfig, userConfig);

            expect(newConfig.lint.jshint).toBe(true);
        });

        it('sets jscs if defined by user', function() {
            var newConfig = {};

            var userConfig = {
                lint: 'jscs'
            };

            lintTool.apply(newConfig, userConfig);

            expect(newConfig.lint.jscs).toBe(true);
        });

        it('sets jscs and jshint if defined by user', function() {
            var newConfig = {};

            var userConfig = {
                lint: ['jscs', 'jshint']
            };

            lintTool.apply(newConfig, userConfig);

            expect(newConfig.lint.jscs).toBe(true);
            expect(newConfig.lint.jshint).toBe(true);
        });

        it('throws when the lint tool name is unsupported', function() {
            var newConfig = {};

            var userConfig = {
                lint: 'zzz'
            };

            expect(() => lintTool.apply(newConfig, userConfig))
                .toThrow(new Error('Unsupported lint tool name: zzz'));
        });

        it('throws when the lint tool can not be combined', function() {
            var newConfig = {};

            var userConfig = {
                lint: ['jshint', 'eslint']
            };

            expect(() => lintTool.apply(newConfig, userConfig))
                .toThrow(new Error('This combination of lint tool are not compatible: [jshint, eslint]'));
        });
    });
});
