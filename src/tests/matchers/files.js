var isThere = require('is-there');
var _ = require('lodash');
var dircompare = require('dir-compare');
var path = require('path');

exports.addMatchers = function() {
    var should = require('should');

    should.Assertion.add('existingFile', function() {
        this.params = { operator: 'to be an existing file' };

        should(isThere(this.obj)).be.exactly(true);
    });

    should.Assertion.add('existingFiles', function() {
        this.params = { operator: 'to be existing files' };

        this.obj.forEach(function(file) {
            should(file).be.an.existingFile();
        });
    });

    should.Assertion.add('equalDirectory', function(expectedDirectory) {
        this.params = { operator: 'to equal directory', expected: expectedDirectory };

        var options = {
            compareContent: true
        };

        var compareResults = dircompare.compareSync(this.obj, expectedDirectory, options);

        if (!compareResults.same) {
            _.forEach(compareResults.diffSet, function(set) {
                console.log(set);

                if (set.state !== 'equal') {
                    var assert = new should.Assertion(path.join('/', set.relativePath, set.name1));

                    assert.params = {
                        operator: 'files to be equals'
                    };

                    assert.fail();
                }
            });
        }
    });
};
