describe('task-register', function() {
    var tasksRegister;
    var gulp;
    var config;
    var module;

    beforeEach(function() {
        tasksRegister = require('./tasks-register')('fake-module');

        gulp = {
            task: jasmine.createSpy('gulp.task')
        };

        module = {
            test: jasmine.createSpy('module.test'),
            /* jscs:disable disallowUnusedParams */
            testWithCallback: function(gulp, config, callback) {}
        };

        config = {};
    });

    describe('getSubTask', function() {
        it('returns the subtask name', function() {
            expect(tasksRegister.getSubTask('test')).toEqual('fake-module:test');
        });
    });

    describe('registerSubTasks', function() {
        it('registers a task with the key name when value is sets to true', function() {
            var tasks = {
                'test': true
            };

            tasksRegister.registerSubTasks(module, config, gulp, tasks);

            expect(gulp.task).toHaveBeenCalledWith('fake-module:test', jasmine.any(Function));
        });

        it('registers a task with an explicit function name', function() {
            var tasks = {
                'another:test': 'test'
            };

            tasksRegister.registerSubTasks(module, config, gulp, tasks);

            expect(gulp.task).toHaveBeenCalledWith('fake-module:another:test', jasmine.any(Function));
        });

        describe('registered task', function() {
            var registeredTask;
            var registeredTaskWithCallback;

            beforeEach(function() {
                var tasks = {
                    'test': true,
                    'test-callback': 'testWithCallback'
                };

                tasksRegister.registerSubTasks(module, config, gulp, tasks);

                registeredTask = gulp.task.calls.first().args[1];
                registeredTaskWithCallback = gulp.task.calls.mostRecent().args[1];
            });

            it('passes the config object to the task function', function() {
                registeredTask();

                expect(module.test).toHaveBeenCalledWith(config, jasmine.any(Object));
            });

            it('passes the gulp object to the task function', function() {
                registeredTask();

                expect(module.test).toHaveBeenCalledWith(jasmine.any(Object), gulp);
            });

            it('passes the callback to the task function', function() {
                expect(registeredTaskWithCallback.length).toBe(1);
            });
        });
    });

    describe('registerTasks', function() {
        it('registers a task with the key name when value is sets to true', function() {
            var tasks = {
                'test': true
            };

            tasksRegister.registerTasks(gulp, tasks);

            expect(gulp.task).toHaveBeenCalledWith('test', jasmine.any(Object));
            expect(gulp.task.calls.first().args[1]).toEqual(['fake-module:test']);
        });

        it('registers a task with an explicit subtask name', function() {
            var tasks = {
                'another:test': 'test'
            };

            tasksRegister.registerTasks(gulp, tasks);

            expect(gulp.task).toHaveBeenCalledWith('another:test', jasmine.any(Object));
            expect(gulp.task.calls.first().args[1]).toEqual(['fake-module:test']);
        });

        it('registers a task with an explicit subtask name array', function() {
            var tasks = {
                'another:test': ['fake-module:test', 'fake-module2:test2']
            };

            tasksRegister.registerTasks(gulp, tasks);

            expect(gulp.task).toHaveBeenCalledWith('another:test', jasmine.any(Object));
            expect(gulp.task.calls.first().args[1]).toEqual(['fake-module:test', 'fake-module2:test2']);
        });
    });
});
