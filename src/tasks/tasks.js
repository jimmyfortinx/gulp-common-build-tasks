'use strict';

var _ = require('lodash');
var namespaceCacheUpdater = require('./namespace-cache-updater');
var flatten = require('./flatten');
var applier = require('./applier');

class Tasks {
    constructor(namespace) {
        this.namespace = namespace || '';

        this._tasks = [];
        this._imports = [];
        this._transformConfigurationFunctions = [];
    }

    setNamespace(namespace) {
        this.namespace = namespace || '';
    }

    addTransformConfigurationFunction(transformConfigurationFunction) {
        this._transformConfigurationFunctions.push(transformConfigurationFunction);
    }

    create(name, dependencies, callback) {
        if (_.findIndex(this._tasks, 'name', name) >= 0) {
            throw new Error('A task with the name \'' + name + '\' already exist.');
        }

        if (_.isFunction(dependencies)) {
            callback = dependencies;
            dependencies = null;
        }

        this._tasks.push({
            name: name,
            dependencies: dependencies,
            callback: callback
        });
    }

    import(tasks) {
        if (_.indexOf(this._imports, tasks) >= 0) {
            throw new Error('These task has been already added.');
        }

        this._imports.push(tasks);
    }

    apply(configuration, customGulp, skipAbsoluteTasks) {
        var gulp = customGulp || require('gulp');

        namespaceCacheUpdater(this);

        var flattenTasks = flatten(this, configuration);
        applier(gulp, flattenTasks, skipAbsoluteTasks);
    }
}

module.exports = Tasks;
