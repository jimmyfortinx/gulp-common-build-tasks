var _ = require('lodash');

module.exports = function(subTasksPrefix) {
    function hasCopyFlag(name) {
        return name === true;
    }

    function getDestinationName(name, taskName) {
        return hasCopyFlag(name) ? taskName : name;
    }

    function registerTasks(gulp, tasks) {
        _.forEach(tasks, registerOne);

        function registerOne(subTaskName, taskName) {
            var partialSubTaskName = getDestinationName(subTaskName, taskName);
            var completeSubTaskName = getSubTask(partialSubTaskName);

            gulp.task(taskName, [completeSubTaskName]);
        }
    }

    function registerSubTasks(module, config, gulp, tasks) {
        _.forEach(tasks, registerOne);

        function registerOne(taskFunctionName, taskName) {
            taskFunctionName = getDestinationName(taskFunctionName, taskName);
            var subTaskName = getSubTask(taskName);

            if (hasCallback(taskFunctionName)) {
                gulp.task(subTaskName, function(callback) {
                    module[taskFunctionName](config, gulp, callback);
                });
            } else {
                gulp.task(subTaskName, function() {
                    module[taskFunctionName](config, gulp);
                });
            }
        }

        function hasCallback(taskFunctionName) {
            return module[taskFunctionName].length === 3;
        }
    }

    function getSubTask(task) {
        return subTasksPrefix + ':' + task;
    }

    return {
        registerTasks: registerTasks,
        registerSubTasks: registerSubTasks,
        getSubTask: getSubTask
    };
};
