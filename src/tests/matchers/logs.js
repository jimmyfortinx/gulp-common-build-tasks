exports.addMatchers = function() {
    var should = require('should');

    should.Assertion.add('containsLog', function(expectedlogPart) {
        this.params = { operator: 'to contains log', expected: expectedlogPart };

        should(this.obj.indexOf(expectedlogPart)).not.be.exactly(-1);
    });
};
