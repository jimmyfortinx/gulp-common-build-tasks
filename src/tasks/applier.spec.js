var _ = require('lodash');

describe('applier', function() {
    var applier;
    var gulpMock;

    beforeEach(function() {
        applier = require('./applier');

        gulpMock = {
            task: jasmine.createSpy('gulpMock.task')
        };
    });

    it('creates gulp task without a done parameter in the callback function', function(done) {
        var doneParameter = _.noop;

        var callback = function() {
            expect(arguments.length).toBe(2);
            done();
        };

        var tasks = [
            { name: 'test', callback: callback }
        ];

        applier(gulpMock, tasks);

        gulpMock.task.calls.first().args[1](doneParameter);
    });

    it('creates gulp task with a done parameter in the callback function', function(done) {
        var expectedDoneParameter = _.noop;

        var callback = function(gulp, config, doneParameter) {
            expect(doneParameter).toBe(expectedDoneParameter);
            done();
        };

        var tasks = [
            { name: 'test', callback: callback }
        ];

        applier(gulpMock, tasks);

        gulpMock.task.calls.first().args[1](expectedDoneParameter);
    });

    it('creates multiple gulp tasks', function() {
        var tasks = [
            { name: 'test', callback: _.noop },
            { name: 'test2', callback: _.noop }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task.calls.count()).toBe(2);
    });

    it('passes gulp as the first parameter', function(done) {
        var callback = function(gulp) {
            expect(gulp).toBe(gulpMock);
            done();
        };

        var tasks = [
            { name: 'test', callback: callback }
        ];

        applier(gulpMock, tasks);

        gulpMock.task.calls.first().args[1]();
    });

    it('passes the config as second parameter', function(done) {
        var configMock = {};

        var callback = function(gulp, config) {
            expect(config).toBe(configMock);
            done();
        };

        var tasks = [
            { name: 'test', callback: callback, config: configMock }
        ];

        applier(gulpMock, tasks);

        gulpMock.task.calls.first().args[1]();
    });

    it('supports dependencies', function() {
        var dependencies = ['test2'];

        var tasks = [
            { name: 'test', dependencies: dependencies }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task).toHaveBeenCalledWith('test', dependencies);
    });

    it('supports dependencies and callback', function() {
        var dependencies = ['test2'];

        var tasks = [
            { name: 'test', dependencies: dependencies, callback: _.noop }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task).toHaveBeenCalledWith('test', dependencies, jasmine.any(Function));
    });

    it('creates a root task when not prefixed with a dot', function() {
        var tasks = [
            { name: 'test', callback: _.noop, namespace: 'namespace.' }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task).toHaveBeenCalledWith('test', jasmine.any(Function));
    });

    it('appends the namespace before the task name when prefixed with a dot', function() {
        var tasks = [
            { name: '.test', callback: _.noop, namespace: 'namespace.' }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task).toHaveBeenCalledWith('namespace.test', jasmine.any(Function));
    });

    it('does not append the namespace on dependencies not prefixed by a dot', function() {
        var dependencies = ['test2'];

        var tasks = [
            { name: 'test', dependencies: dependencies, namespace: 'namespace.' }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task).toHaveBeenCalledWith('test', dependencies);
    });

    it('appends the namespace to each dependencies prefixed by a dot', function() {
        var expectedDependencies = ['namespace.test2'];

        var tasks = [
            { name: 'test', dependencies: ['.test2'], namespace: 'namespace.' }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task).toHaveBeenCalledWith('test', expectedDependencies);
    });

    it('skips all absolute tasks when asked', function() {
        var tasks = [
            { name: 'test', callback: _.noop },
            { name: '.test2', callback: _.noop }
        ];

        applier(gulpMock, tasks, true);

        expect(gulpMock.task.calls.count()).toBe(1);
        expect(gulpMock.task).toHaveBeenCalledWith('test2', jasmine.any(Function));
    });

    it('adds a fake task if no callback and no dependencies', function() {
        var tasks = [
            { name: 'test', dependencies: [] }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task.calls.count()).toBe(1);
        expect(gulpMock.task).toHaveBeenCalledWith('test', jasmine.any(Function));
    });

    it('adds a fake task when it is wrapped into a condition function that return false', function() {
        var conditionalDependencyFunctionReturnsFalse = function() {
            return () => false;
        };

        var tasks = [
            { name: 'test', dependencies: [conditionalDependencyFunctionReturnsFalse('test')] }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task.calls.count()).toBe(1);
        expect(gulpMock.task).toHaveBeenCalledWith('test', jasmine.any(Function));
    });

    it('includes a dependency when it is wrap into a condition function that return true', function() {
        var conditionalDependencyFunctionReturnsTrue = function() {
            return () => 'test2';
        };

        var tasks = [
            { name: 'test', dependencies: [conditionalDependencyFunctionReturnsTrue()] }
        ];

        applier(gulpMock, tasks);

        expect(gulpMock.task).toHaveBeenCalledWith('test', ['test2']);
    });

    it('passes config as parameter of the dependency condition function', function() {
        var configMock = {};
        var conditionalDependencyFunctionSpy = jasmine.createSpy('conditionalDependencyFunction');

        var tasks = [
            { name: 'test', dependencies: [conditionalDependencyFunctionSpy], config: configMock }
        ];

        applier(gulpMock, tasks);

        expect(conditionalDependencyFunctionSpy).toHaveBeenCalledWith(configMock);
    });
});
