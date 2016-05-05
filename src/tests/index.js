exports.addMatchers = function() {
    require('./matchers/files').addMatchers();
    require('./matchers/logs').addMatchers();
};

exports.Configuration = require('./configuration');
