var gulpUtils = require('./gulp');

describe('utils/gulp', function() {
    describe('files', function() {
        it('appends folder and file name', function() {
            var folders = 'folder';
            var files = 'file.js';

            var expectedFiles = 'folder\\file.js';

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });

        it('appends two folders with one file name', function() {
            var folders = ['folder1', 'folder2'];
            var files = 'file.js';

            var expectedFiles = [
                'folder1\\file.js',
                'folder2\\file.js'
            ];

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });

        it('appends one folder with two files name', function() {
            var folders = 'folder';
            var files = ['file1.js', 'file2.js'];

            var expectedFiles = [
                'folder\\file1.js',
                'folder\\file2.js'
            ];

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });

        it('appends two folder with two files name', function() {
            var folders = ['folder1', 'folder2'];
            var files = ['file1.js', 'file2.js'];

            var expectedFiles = [
                'folder1\\file1.js',
                'folder1\\file2.js',
                'folder2\\file1.js',
                'folder2\\file2.js'
            ];

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });
    });
});
