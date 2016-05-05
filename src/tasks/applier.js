var _ = require('lodash');

function hasDoneParameter(task) {
    return task.callback.length === 3;
}

function applyTask(gulp, task, skipAbsoluteTasks) {
    if (skipAbsoluteTasks && !isRelativeTask(task.name)) {
        return;
    }

    var taskName = processRelativeTaskName(task.name, task.namespace);
    var dependencies = getDependencies(task);

    if (!_.isEmpty(dependencies)) {
        if (task.callback) {
            gulp.task(taskName, dependencies, generateGulpTaskFunction(gulp, task));
        } else {
            gulp.task(taskName, dependencies);
        }
    } else {
        if (task.callback) {
            gulp.task(taskName, generateGulpTaskFunction(gulp, task));
        } else {
            gulp.task(taskName, function() {});
        }
    }
}

function generateGulpTaskFunction(gulp, task) {
    if (hasDoneParameter(task)) {
        return function(done) {
            task.callback(gulp, task.config, done);
        };
    } else {
        return function() {
            return task.callback(gulp, task.config);
        };
    }
}

function getDependencies(task) {
    if (!task.namespace) {
        return _(task.dependencies)
            .map(dependency => executeConditionalDependencyFunction(dependency, task.config))
            .compact()
            .value();
    }

    return _(task.dependencies)
        .map(dependency => executeConditionalDependencyFunction(dependency, task.config))
        .map(dependency => processRelativeTaskName(dependency, task.namespace))
        .compact()
        .value();
}

function executeConditionalDependencyFunction(dependency, config) {
    if (_.isString(dependency)) {
        return dependency;
    }

    return dependency(config);
}

function processRelativeTaskName(relativeTaskName, namespace) {
    if (!namespace) {
        namespace = '';
    }

    if (isRelativeTask(relativeTaskName)) {
        return namespace + relativeTaskName.substr(1);
    }

    return relativeTaskName;
}

function isRelativeTask(taskName) {
    return taskName[0] === '.';
}

module.exports = function(gulp, tasks, skipAbsoluteTasks) {
    _.forEach(tasks, task => {
        applyTask(gulp, task, skipAbsoluteTasks);
    });
};
