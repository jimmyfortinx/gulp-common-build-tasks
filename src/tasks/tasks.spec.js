var proxyquire =  require('proxyquire');
var _ = require('lodash');

describe('tasks', function() {
    var Tasks;
    var tasks;

    var gulpMock;

    beforeEach(function() {
        gulpMock = {
            task: jasmine.createSpy('gulpMock.task')
        };

        Tasks = proxyquire('./tasks', {
            'gulp': gulpMock
        });
        tasks = new Tasks();
    });

    it('returns no tasks by default', function() {
        expect(tasks._tasks).toEqual([]);
    });

    it('returns no imports by default', function() {
        expect(tasks._imports).toEqual([]);
    });

    it('returns no transformation configuration functions by default', function() {
        expect(tasks._transformConfigurationFunctions).toEqual([]);
    });

    describe('constructor', function() {
        it('sets the namespace to empty string if no namespace', function() {
            expect(tasks.namespace).toBe('');
        });

        it('sets the namespace using the value passed', function() {
            tasks = new Tasks('fakeNamespace');

            expect(tasks.namespace).toBe('fakeNamespace');
        });
    });

    describe('setNamespace', function() {
        it('defines a namespace', function() {
            tasks.setNamespace('aNamespace');

            expect(tasks.namespace).toBe('aNamespace');
        });
    });

    describe('create', function() {
        it('creates a new task with a callback', function() {
            var aFunction = _.noop;
            var expectedTasks = [
                { name: 'taskName', dependencies: null, callback: aFunction }
            ];

            tasks.create('taskName', aFunction);

            expect(tasks._tasks).toEqual(expectedTasks);
        });

        it('creates a new task with dependencies', function() {
            var aFunction = _.noop;
            var dependencies = ['test'];
            var expectedTasks = [
                { name: 'taskName', dependencies: dependencies, callback: aFunction }
            ];

            tasks.create('taskName', dependencies, aFunction);

            expect(tasks._tasks).toEqual(expectedTasks);
        });

        it('creates a new task with a callback and dependencies', function() {
            var dependencies = ['test'];
            var expectedTasks = [
                { name: 'taskName', dependencies: dependencies, callback: undefined }
            ];

            tasks.create('taskName', dependencies);

            expect(tasks._tasks).toEqual(expectedTasks);
        });

        it('throws if the task already exist', function() {
            tasks.create('taskName', _.noop);

            expect(function() {
                tasks.create('taskName', _.noop);
            }).toThrow(new Error('A task with the name \'taskName\' already exist.'));
        });
    });

    describe('import', function() {
        it('imports tasks', function() {
            var newTasks = new Tasks();
            var expectedImports = [
                newTasks
            ];

            tasks.import(newTasks);

            expect(tasks._imports).toEqual(expectedImports);
        });

        it('throws if tasks has already been imported', function() {
            var newTasks = new Tasks();

            tasks.import(newTasks);

            expect(function() {
                tasks.import(newTasks);
            }).toThrow(new Error('These task has been already added.'));
        });
    });

    describe('addTransformConfigurationFunction', function() {
        it('adds the function', function() {
            var transformConfigurationFunctionMock = _.noop;

            tasks.addTransformConfigurationFunction(transformConfigurationFunctionMock);

            expect(tasks._transformConfigurationFunctions).toEqual([transformConfigurationFunctionMock]);
        });
    });
});
