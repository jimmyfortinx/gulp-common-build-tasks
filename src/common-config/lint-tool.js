var _ = require('lodash');

exports.apply = function(config, userConfig) {
    userConfig = userConfig || {};

    userConfig.lint = _.get(userConfig, 'lint', 'auto');

    if (_.isArray(userConfig.lint)) {
        userConfig.lint.forEach(lintToolName => addLintTool(config, userConfig, lintToolName));
    } else {
        addLintTool(config, userConfig, userConfig.lint);
    }
};

function addLintTool(config, userConfig, lintToolName) {
    var friendsLintTool = getFriendsLintTool(lintToolName);

    switch (lintToolName) {
        case 'auto':
            checkFriendsLintTool(userConfig, lintToolName);
            _.set(config, 'lint.auto', true);
            break;
        case 'eslint':
            checkFriendsLintTool(userConfig, lintToolName);
            _.set(config, 'lint.eslint', true);
            break;
        case 'jshint':
            checkFriendsLintTool(userConfig, lintToolName, 'jscs');
            _.set(config, 'lint.jshint', true);
            break;
        case 'jscs':
            checkFriendsLintTool(userConfig, lintToolName, 'jshint');
            _.set(config, 'lint.jscs', true);
            break;
        default:
            throw new Error('Unsupported lint tool name: ' + lintToolName);
    }
}

function getFriendsLintTool(lintToolName) {
    switch (lintToolName) {
        case 'auto':
            return null;
        case 'eslint':
            return null;
        case 'jshint':
            return 'jscs';
        case 'jscs':
            return 'jshint';
    }
}

function checkFriendsLintTool(userConfig, lintToolName, friends) {
    if (!_.isArray(userConfig.lint)) {
        return;
    }

    var supportedlintTools = _.flatten([lintToolName, friends]);
    var unsupportedFriends = _.difference(userConfig.lint, supportedlintTools);

    if (unsupportedFriends.length > 0) {
        throw new Error('This combination of lint tool are not compatible: [' + _(userConfig.lint).join(', ') + ']');
    }
}
