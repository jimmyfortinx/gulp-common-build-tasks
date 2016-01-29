var functions = require('./functions');

exports.apply = function(config, userConfig) {
    config.projectDirectory = functions.getProjectDirectory(userConfig);

    config.jshintEnabled = functions.hasJSHintFile(config.projectDirectory);
    config.jscsEnabled = functions.hasJSCSFile(config.projectDirectory);

    if (config.jshintEnabled) {
        functions.addDefaultJsHintConfig(config);
    }
};
