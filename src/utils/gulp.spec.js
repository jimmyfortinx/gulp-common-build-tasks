var gulpUtils = require('./gulp');
var path = require('path');

describe('utils/gulp', function() {
    describe('files', function() {
        it('appends folder and file name', function() {
            var folders = 'folder';
            var files = 'file.js';

            var expectedFiles = path.join('folder', 'file.js');

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });

        it('appends two folders with one file name', function() {
            var folders = ['folder1', 'folder2'];
            var files = 'file.js';

            var expectedFiles = [
                path.join('folder1', 'file.js'),
                path.join('folder2', 'file.js')
            ];

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });

        it('appends one folder with two files name', function() {
            var folders = 'folder';
            var files = ['file1.js', 'file2.js'];

            var expectedFiles = [
                path.join('folder', 'file1.js'),
                path.join('folder', 'file2.js')
            ];

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });

        it('appends two folder with two files name', function() {
            var folders = ['folder1', 'folder2'];
            var files = ['file1.js', 'file2.js'];

            var expectedFiles = [
                path.join('folder1', 'file1.js'),
                path.join('folder1', 'file2.js'),
                path.join('folder2', 'file1.js'),
                path.join('folder2', 'file2.js')
            ];

            expect(gulpUtils.files(folders, files))
                .toEqual(expectedFiles);
        });
    });
});
