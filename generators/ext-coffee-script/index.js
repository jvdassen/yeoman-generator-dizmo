'use strict';

var yeoman = require('yeoman-generator'),
    lodash = require('lodash'),
    rimraf = require('rimraf');

function sort(dictionary) {
    var array = [],
        sorted = {};

    for(var key in dictionary) {
        array[array.length] = key;
    }
    array.sort();

    for(var i = 0; i < array.length; i++) {
        sorted[array[i]] = dictionary[array[i]];
    }
    return sorted;
}

module.exports = yeoman.generators.Base.extend({
    writing: function () {
        var pkg = this._package();
        this.template(
            this.templatePath('gulp/'),
            this.destinationPath('gulp/'), pkg);
        this.template(
            this.templatePath('src/'),
            this.destinationPath('src/'), pkg);
        this.template(
            this.templatePath('coffeelint.json'),
            this.destinationPath('coffeelint.json'), pkg);
    },

    install: function () {
        this.npmInstall('', {'cache-min': 604800});
    },

    end: function () {
        rimraf.sync(
            this.destinationPath('src/index.js'));
        rimraf.sync(
            this.destinationPath('src/style/style.css'));
    },

    _package: function () {
        var pkg = this.fs.readJSON(
            this.destinationPath('package.json'));

        pkg.devDependencies = sort(lodash.assign(pkg.devDependencies, {
            'gulp-batch': '^1.0.5',
            'gulp-coffee': '^2.3.2',
            'gulp-coffeelint': '^0.6.0',
            'gulp-htmlmin': '^2.0.0',
            'gulp-sass': '^2.3.2',
            'gulp-sourcemaps': '^1.6.0',
            'gulp-streamify': '^1.0.2',
            'gulp-uglify': '^1.5.3',
            'gulp-watch': '^4.3.8'
        }));

        this.fs.writeJSON(
            this.destinationPath('package.json'), pkg, null, 2);

        return pkg;
    }
});
