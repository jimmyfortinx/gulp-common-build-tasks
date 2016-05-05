var Promise = require('bluebird');
var mkdirp = Promise.promisify(require('mkdirp'));
var ncp = Promise.promisify(require('ncp').ncp);
var exec = require('child-process-promise').exec;
var path = require('path');

function Configuration(cwd, name) {
    this.source = path.join(cwd, 'configurations', name);
    this.destination = path.join(cwd, '../.tmp/configurations', name);
    this.actualDist = path.join(this.destination, 'dist');
    this.expectedDist = path.join(cwd, 'configurations/expected/', name);
}

Configuration.prototype.copy = function() {
    var _this = this;

    return mkdirp(this.destination)
        .then(function() {
            return ncp(_this.source, _this.destination);
        })
        .then(function() {
            return _this;
        });
};

Configuration.prototype.exec = function(command) {
    return exec(command, { cwd: this.destination });
};

module.exports = Configuration;
