var _ = require('lodash');
var path = require('path');

function getProjectDirectory(userConfig) {
    // This parameter is useful only when npm link is used
    if (_.has(userConfig, 'projectDirectory')) {
        return userConfig.projectDirectory;
    } else {
        return path.join(__dirname, '../../../..');
    }
}

exports.apply = function(config, userConfig) {
    config.projectDirectory = getProjectDirectory(userConfig);
};
