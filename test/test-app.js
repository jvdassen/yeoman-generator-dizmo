const assert = require('yeoman-assert');
const { run } = require('yeoman-test');
const { join } = require('path');

describe('generator-dizmo:app', function () {
    const generator = join(__dirname, '../generators/app');
    it('yo @dizmo/dizmo', () => {
        return run(generator).withOptions({
            'author': 'Dizmo Developer',
            'bundle-id': 'com.dizmo.my_dizmo',
            'email': 'developer@dizmo.com'
        }).then(() => {
            assert.file([
                'assets',
                'assets/Icon-dark.svg',
                'assets/Icon.svg',
                'assets/locales',
                'assets/locales/translation.de.json',
                'assets/locales/translation.en.json',
                'assets/Preview.png',
                '.eslintrc.json',
                'gulp',
                'gulp/miscellanea',
                'gulp/miscellanea/cli-spinner.js',
                'gulp/package.js',
                'gulp/scripts',
                'gulp/scripts/build.js',
                'gulp/scripts/clean.js',
                'gulp/scripts/deploy.js',
                'gulp/scripts/lint.js',
                'gulp/scripts/upload.js',
                'gulp/scripts/watch.js',
                'gulp/tasks',
                'gulp/tasks/build',
                'gulp/tasks/build/assets',
                'gulp/tasks/build/assets/index.js',
                'gulp/tasks/build/assets/watch.js',
                'gulp/tasks/build/dizmo',
                'gulp/tasks/build/dizmo/index.js',
                'gulp/tasks/build/dizmo/watch.js',
                'gulp/tasks/build/help',
                'gulp/tasks/build/help/index.js',
                'gulp/tasks/build/help/watch.js',
                'gulp/tasks/build/index.js',
                'gulp/tasks/build/libraries',
                'gulp/tasks/build/libraries/index.js',
                'gulp/tasks/build/libraries/watch.js',
                'gulp/tasks/build/markup',
                'gulp/tasks/build/markup/index.js',
                'gulp/tasks/build/markup/watch.js',
                'gulp/tasks/build/properties',
                'gulp/tasks/build/properties/index.js',
                'gulp/tasks/build/properties/watch.js',
                'gulp/tasks/build/scripts',
                'gulp/tasks/build/scripts/index.js',
                'gulp/tasks/build/scripts/watch.js',
                'gulp/tasks/build/styles',
                'gulp/tasks/build/styles/index.js',
                'gulp/tasks/build/styles/watch.js',
                'gulp/tasks/build/watch.js',
                'gulp/tasks/clean',
                'gulp/tasks/clean/index.js',
                'gulp/tasks/deploy',
                'gulp/tasks/deploy/index.js',
                'gulp/tasks/deploy/watch.js',
                'gulp/tasks/lint',
                'gulp/tasks/lint/index.js',
                'gulp/tasks/upload',
                'gulp/tasks/upload/index.js',
                'gulp/tasks/watch',
                'gulp/tasks/watch/index.js',
                'gulpfile.js',
                'help',
                'help/en',
                'help/en/help.md',
                'help/en/placeholder-400x275.png',
                '.info.plist',
                'LICENSE',
                '.npmignore',
                'package.json',
                'README.md',
                'src',
                'src/index.html',
                'src/index.js',
                'src/lib',
                'src/lib/i18n-2.0.0.min.js',
                'src/lib/i18n-2.0.0.min.js.map',
                'src/style',
                'src/style/style.scss',
                'webpack.config.js',
                '.yo-rc.json',
            ]);
            assert.jsonFileContent('package.json', {
                'name': 'MyDizmo',
                'description': 'My Dizmo',
                'version': '0.0.0',
                'author': {
                    'name': 'Dizmo Developer',
                    'email': 'developer@dizmo.com'
                },
                'contributors': [
                    {
                        'name': 'Dizmo Developer',
                        'email': 'developer@dizmo.com'
                    }
                ],
                'dizmo': {
                    'settings': {
                        'attributes': {
                            'settings/usercontrols/allowresize': true
                        },
                        'bundle-identifier': 'com.dizmo.my_dizmo',
                        'bundle-name': 'MyDizmo',
                        'category': '',
                        'height': 360,
                        'tags': [
                            'my-dizmo'
                        ],
                        'width': 480
                    },
                    'store': {
                        'host': 'https://store-api.dizmo.com'
                    }
                },
                'dependencies': {
                    '@babel/polyfill': '^7.8.7'
                },
                'devDependencies': {
                    '@babel/core': '^7.9.6',
                    '@babel/preset-env': '^7.9.6',
                    'ansi-colors': '^4.1.1',
                    'babel-loader': '^8.1.0',
                    'fancy-log': '^1.3.3',
                    'gulp': '^4.0.2',
                    'gulp-copy': '^4.0.1',
                    'gulp-eslint': '^6.0.0',
                    'gulp-htmlmin': '^5.0.1',
                    'gulp-plist': '^0.9.0',
                    'gulp-rename': '^2.0.0',
                    'gulp-sass': '^4.1.0',
                    'gulp-sourcemaps': '^2.6.5',
                    'gulp-ver': '^0.1.0',
                    'gulp-zip': '^5.0.1',
                    'rimraf': '^3.0.2',
                    'webpack': '^4.43.0',
                    'webpack-stream': '^5.2.1'
                },
                'optionalDependencies': {
                    'closure-webpack-plugin': '^2.3.0',
                    'google-closure-compiler': '^20200406.0.0',
                    'pump': '^3.0.0',
                    'webpack-obfuscator': '^0.28.0'
                },
                'license': 'ISC',
                'private': true,
                'repository': {
                    'type': 'git',
                    'url': ''
                },
                'scripts': {
                    'build': 'node ./gulp/scripts/build.js',
                    'clean': 'node ./gulp/scripts/clean.js',
                    'deploy': 'node ./gulp/scripts/deploy.js',
                    'lint': 'node ./gulp/scripts/lint.js',
                    'test': 'exit 0',
                    'upload': 'node ./gulp/scripts/upload.js',
                    'watch': 'node ./gulp/scripts/watch.js'
                }
            });
        });
    });
    it('yo @dizmo/dizmo --git', () => {
        return run(generator).withOptions({
            'author': 'Dizmo Developer',
            'bundle-id': 'com.dizmo.my_dizmo',
            'email': 'developer@dizmo.com',
            'git': true
        }).then(() => {
            assert.file([
                '.gitignore'
            ]);
            assert.noFile([
                '.npmignore'
            ]);
        });
    });
});
