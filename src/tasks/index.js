var Tasks = require('./tasks');

module.exports = function(namespace) {
    return new Tasks(namespace);
};
