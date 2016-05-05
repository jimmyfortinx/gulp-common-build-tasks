var lintTool = require('./lint-tool');
var projectDirectory = require('./project-directory');

exports.apply = function(config, userConfig) {
    projectDirectory.apply(config, userConfig);
    lintTool.apply(config, userConfig);
};
