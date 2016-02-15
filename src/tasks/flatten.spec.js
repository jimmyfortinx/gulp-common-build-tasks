var _ = require('lodash');

var flatten = require('./flatten');

describe('flatten', function() {
    it('returns all tasks of the same level', function() {
        var expectedFlattenTasks = [
            jasmine.objectContaining({ name: 'test', callback: _.noop }),
            jasmine.objectContaining({ name: 'test2', callback: _.noop })
        ];

        var rootTasks = {
            _tasks: [
                { name: 'test', callback: _.noop },
                { name: 'test2', callback: _.noop }
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('puts imported tasks before root tasks', function() {
        var expectedFlattenTasks = [
            jasmine.objectContaining({ name: 'importedTest', callback: _.noop }),
            jasmine.objectContaining({ name: 'test', callback: _.noop })
        ];

        var rootTasks = {
            _tasks: [
                { name: 'test', callback: _.noop }
            ],

            _imports: [
                {
                    _tasks: [{ name: 'importedTest', callback: _.noop }]
                }
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('stores the namespace in task', function() {
        var expectedFlattenTasks = [
            jasmine.objectContaining({ name: 'importedTest', callback: _.noop, namespace: 'rootNamespace.namespace.' }),
            jasmine.objectContaining({ name: 'test', callback: _.noop, namespace: 'rootNamespace.' })
        ];

        var rootTasks = {
            _completeNamespace: 'rootNamespace.',
            _tasks: [
                { name: 'test', callback: _.noop }
            ],

            _imports: [
                {
                    _completeNamespace: 'rootNamespace.namespace.',
                    _tasks: [{ name: 'importedTest', callback: _.noop }]
                }
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('transforms config on root tasks', function() {
        var transformedConfig = {};

        var expectedFlattenTasks = [
            { name: 'test', callback: _.noop, config: transformedConfig }
        ];

        var rootTasks = {
            _transformConfigurationFunctions: [() => transformedConfig],
            _tasks: [
                { name: 'test', callback: _.noop }
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('transforms config on imported tasks only', function() {
        var transformedConfig = {};

        var expectedFlattenTasks = [
            { name: 'importedTest', callback: _.noop, config: transformedConfig },
            { name: 'test', callback: _.noop, config: undefined }
        ];

        var rootTasks = {
            _tasks: [
                { name: 'test', callback: _.noop }
            ],

            _imports: [
                {
                    _transformConfigurationFunctions: [() => transformedConfig],
                    _tasks: [{ name: 'importedTest', callback: _.noop }]
                }
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('transforms config on root and imported tasks', function() {
        var transformedConfig = {};

        var expectedFlattenTasks = [
            { name: 'importedTest', callback: _.noop, config: transformedConfig },
            { name: 'test', callback: _.noop, config: transformedConfig }
        ];

        var rootTasks = {
            _transformConfigurationFunctions: [() => transformedConfig],
            _tasks: [
                { name: 'test', callback: _.noop }
            ],

            _imports: [
                {
                    _tasks: [{ name: 'importedTest', callback: _.noop }]
                }
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('does not import tasks if wrapped in a function that returns false', function() {
        var expectedFlattenTasks = [];

        function condition() {
            return () => false;
        }

        var rootTasks = {
            _imports: [
                condition({
                    _tasks: [{ name: 'importedTest', callback: _.noop }]
                })
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('imports tasks if wrapped in a function that returns true', function() {
        var expectedFlattenTasks = [
            jasmine.objectContaining({ name: 'importedTest', callback: _.noop })
        ];

        function condition(value) {
            return () => value;
        }

        var rootTasks = {
            _imports: [
                condition({
                    _tasks: [{ name: 'importedTest', callback: _.noop }]
                })
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });

    it('passes config as parameter of the condition function', function() {
        var configMock = {};

        var conditionSpy = jasmine.createSpy('conditionSpy');

        var rootTasks = {
            _imports: [
                conditionSpy
            ]
        };

        var flattenTasks = flatten(rootTasks, configMock);

        expect(conditionSpy).toHaveBeenCalledWith(configMock);
    });

    it('calls namespaceCacheUpdater on conditionaly imported tasks', function() {
        var expectedFlattenTasks = [
            jasmine.objectContaining({ name: 'importedTest', namespace: 'namespace.' })
        ];

        function condition(value) {
            return () => value;
        }

        var rootTasks = {
            _completeNamespace: 'namespace.',

            _imports: [
                condition({
                    _tasks: [{ name: 'importedTest', callback: _.noop }]
                })
            ]
        };

        var flattenTasks = flatten(rootTasks);

        expect(flattenTasks).toEqual(expectedFlattenTasks);
    });
});
