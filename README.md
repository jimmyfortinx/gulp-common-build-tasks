# gulp-common-build-tasks
[![NPM Version](https://img.shields.io/npm/v/gulp-common-build-tasks.svg?style=flat-square)](https://www.npmjs.org/package/gulp-common-build-tasks)
[![Download Month](https://img.shields.io/npm/dm/gulp-common-build-tasks.svg?style=flat-square)](https://www.npmjs.org/package/gulp-common-build-tasks)

You can found in this library some utilities and tasks that can be shared between multiple gulp's build processes.

## Install
```
npm install gulp-common-build-tasks
```

## Usage
```
var common = require('gulp-common-build-tasks');
```

## common.tasks
This is a wrapper over gulp that gives more functionnalities to it.

### Tasks group
```
var common = require('gulp-common-build-tasks');

var tasks = common.tasks();

module.exports = tasks;
```

### Namespaced tasks group
Namespaced tasks groups will prefix every subtasks under this namespace.

Example: A task named ```.test``` under the namespace ```application``` will create a
gulp task named ```namespace.test```.

#### When a group is created
```
var common = require('gulp-common-build-tasks');

var tasks = common.tasks('namespace');

module.exports = tasks;
```

#### Later
```
tasks.setNamespace('namespace');
```

### Task
```tasks.create(taskName, dependencies?, gulpFunction?)```

```
tasks.create('.aTask', ['.anotherTask'], function(gulp, config) {
    [...]
});
```
#### Task name
If a task name is prefixed with a dot ```.```, like ```.aTask```, it will create a relative task name
based on the namespace.

If the dot ```.``` is not present, it will be considered as a root task name.

This is also real when working with dependencies.

### Import a tasks group
```javascript
tasks.import(require('./anotherTasks'));
```

### Conditionally apply a dependency or an import
If you wrap the dependency name or the ```require()``` with a function you can create tasks based on
the result of this function.
#### Dependencies
```javascript
function someFeatureEnabled(taskName) {
    return function(config) {
        return config.isSomeFeatureEnabled ? taskName : false;
    };
}

tasks.create('.aTask', [someFeatureEnabled('.anotherTask')]);
```

#### Import
```javascript
function someFeatureEnabled(importedTasks) {
    return function(config) {
        return config.isSomeFeatureEnabled ? importedTasks : false;
    };
}

tasks.import(someFeatureEnabled(require('.anotherTask')));
```

## common.scripts
A tasks group that provide two gulp task:
* **.jshint**
* **.jscs**

So you just need to import it in your tasks group with ```tasks.import(common.scripts)```.

## common.config
An utility that fills a config with default values like:
* **projectDirectory**: Finds the current project directory if not already defined
* **jshintEnabled**: Checks if the project has a ```.jshintrc``` file.
* **jscsEnabled**: Checks if the project has a ```.jscsrc``` file.

## Creator
**Jimmy Fortin**