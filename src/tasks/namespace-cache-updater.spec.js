describe('namespace-cache-updater', function() {
    var updater = require('./namespace-cache-updater');

    it('appends a dot after the namespace name', function() {
        var tasks = {
            namespace: 'namespace'
        };

        updater(tasks);

        expect(tasks._completeNamespace).toBe('namespace.');
    });

    it('appends the imported tasks namespace to the parent namespace', function() {
        var tasks = {
            namespace: 'namespace',

            _imports: [
                { namespace: 'importedNamespace' }
            ]
        };

        updater(tasks);

        expect(tasks._imports[0]._completeNamespace).toBe('namespace.importedNamespace.');
    });

    it('supports parentNamespace as paramater', function() {
        var tasks = {};

        updater(tasks, 'namespace.');

        expect(tasks._completeNamespace).toBe('namespace.');
    });
});
