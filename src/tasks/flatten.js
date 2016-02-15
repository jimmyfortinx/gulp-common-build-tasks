var _ = require('lodash');
var namespaceCacheUpdater = require('./namespace-cache-updater');

function flatten(flattenTasks, tasks, previousCompleteNamespace, config) {
    if (_.isFunction(tasks)) {
        tasks = tasks(config);

        namespaceCacheUpdater(tasks, previousCompleteNamespace);
    }

    if (!tasks) {
        return;
    }

    var transformedConfig = applyConfigTranformations(tasks, config);

    _.forEach(tasks._imports, imported => flatten(flattenTasks, imported, tasks._completeNamespace, transformedConfig));
    _.forEach(tasks._tasks, task => addTaskToList(flattenTasks, tasks._completeNamespace, task, transformedConfig));
}

function addTaskToList(flattenTasks, namespace, task, config) {
    var taskClone = _.clone(task);

    if (namespace) {
        taskClone.namespace = namespace;
    }
    taskClone.config = config;

    flattenTasks.push(taskClone);
}

function applyConfigTranformations(tasks, originalConfiguration) {
    var configuration = originalConfiguration;

    _.forEach(tasks._transformConfigurationFunctions, transformFunction => {
        configuration = transformFunction(configuration);
    });

    return configuration;
}

module.exports = function(tasks, config) {
    var flattenTasks = [];

    flatten(flattenTasks, tasks, '', config);

    return flattenTasks;
};
