var _ = require('lodash');

function getCurrentNamespace(parentNamespace, tasks) {
    if (_.isEmpty(parentNamespace) && _.isEmpty(tasks.namespace)) {
        return '';
    } else if (_.isEmpty(parentNamespace)) {
        return tasks.namespace + '.';
    } else if (_.isEmpty(tasks.namespace)) {
        return parentNamespace;
    } else {
        return parentNamespace + tasks.namespace + '.';
    }
}

function processNamespace(tasks, parentNamespace) {
    if (!tasks) {
        return;
    }

    tasks._completeNamespace = getCurrentNamespace(parentNamespace, tasks);

    _.forEach(tasks._imports, imported => processNamespace(imported, tasks._completeNamespace));
}

module.exports = function(tasks, parentNamespace) {
    if (_.isEmpty(parentNamespace)) {
        processNamespace(tasks, '');
    } else {
        processNamespace(tasks, parentNamespace);
    }

    return tasks;
};
