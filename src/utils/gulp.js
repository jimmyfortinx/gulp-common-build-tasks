var path = require('path');
var _ = require('lodash');

function filesForOneFolder(folder, filesName) {
    if (_.isArray(filesName)) {
        return filesName.map(function(fileName) {
            return path.join(folder, fileName);
        });
    }

    return path.join(folder, filesName);
}

exports.files = function(folders, filesName) {
    if (_.isArray(folders)) {
        var files = folders.map(function(folder) {
            return filesForOneFolder(folder, filesName);
        });

        return _.flatten(files);
    }

    return filesForOneFolder(folders, filesName);
};
