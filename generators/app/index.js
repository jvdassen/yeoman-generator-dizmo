'use strict';

var chalk = require('chalk'),
    fs = require('fs'),
    generators = require('yeoman-generator'),
    lodash = require('lodash'),
    os = require('os'),
    path = require('path'),
    process = require('process'),
    shell = require('shelljs'),
    yosay = require('yosay');

function mine (fn) {
    return function () {
        return fn.apply(this, [this].concat(
            Array.prototype.slice.call(
                arguments
            )
        ));
    };
}

module.exports = generators.extend({
    constructor: function () {
        generators.apply(this, arguments);

        this.argument('name', {
            defaults: 'MyDizmo',
            required: false,
            type: String
        });
        this.option('description', {
            desc: 'Short one-liner describing the dizmo',
            type: String
        });
        this.option('bundle-id', {
            desc: 'Bundle identifier in reverse domain notation',
            type: String
        });

        this.option('author', {
            defaults: this.user.git.name() || process.env.USER,
            desc: 'Name of the author',
            type: String
        });
        this.option('email', {
            defaults: this.user.git.email() || process.env.MAIL,
            desc: 'Email of the author',
            type: String
        });

        this.option('git', {
            defaults: false,
            desc: 'GIT repository initialization',
            type: Boolean
        });
        this.option('coffee-script', {
            defaults: false,
            desc: 'Sub-generator with CoffeeScript',
            type: Boolean
        });
        this.option('type-script', {
            defaults: false,
            desc: 'Sub-generator with TypeScript',
            type: Boolean
        });
    },

    prompting: mine(function (self) {
        var prompts = [], pkg = fs.existsSync('package.json')
            ? JSON.parse(fs.readFileSync('package.json'))
            : {};

        this.log(yosay(
            'Welcome to the awesome {0} generator!'.replace(
                '{0}', chalk.green.bold('dizmo')
            )
        ));

        prompts.push({
            type: 'input',
            name: 'dizmoName',
            message: 'Name your dizmo:',
            default: function (prop) {
                if (pkg && pkg.name) {
                    return pkg.name;
                }
                return lodash.upperFirst(
                    lodash.camelCase(self.options['name']));
            },
            when: function (prop) {
                if (pkg && pkg.name) {
                    prop.dizmoName = pkg.name;
                    return false;
                }
                if (self.args.length > 0) {
                    prop.dizmoName = self.args[0];
                    return false;
                }
                return true;
            }
        });

        prompts.push({
            type: 'input',
            name: 'dizmoDescription',
            message: 'Describe it:',
            default: function (prop) {
                if (pkg && pkg.description) {
                    return pkg.description;
                }
                return self.dizmoDescription
                    || lodash.startCase(prop.dizmoName);
            },
            when: function (prop) {
                if (pkg && pkg.description) {
                    prop.dizmoDescription = pkg.description;
                    return false;
                }
                if (self.options['description']) {
                    prop.dizmoDescription = self.options['description'];
                    return false;
                }
                return true;
            }
        });

        prompts.push({
            type: 'input',
            name: 'bundleId',
            message: 'And its bundle ID?',
            default: function (prop) {
                if (pkg && pkg.dizmo && pkg.dizmo.settings &&
                    pkg.dizmo.settings['bundle-identifier'])
                {
                    return pkg.dizmo.settings['bundle-identifier'];
                }
                var domain =
                        self.config.get('domain') || self._domain(),
                    bundle_id =
                        domain + '.' + lodash.snakeCase(prop.dizmoName);

                return self.bundleId || bundle_id;
            },
            when: function (prop) {
                if (pkg && pkg.dizmo && pkg.dizmo.settings &&
                    pkg.dizmo.settings['bundle-identifier'])
                {
                    prop.bundleId = pkg.dizmo.settings['bundle-identifier'];
                    return false;
                }
                if (self.options['bundle-id']) {
                    prop.bundleId = self.options['bundle-id'];
                    return false;
                }
                return true;
            }
        });

        prompts.push({
            store: true,
            type: 'input',
            name: 'personName',
            message: 'What\'s your name?',
            default: function (prop) {
                if (pkg && pkg.person && pkg.person.name) {
                    return pkg.person.name;
                }
                return self.personName;
            },
            when: function (prop) {
                if (pkg && pkg.person && pkg.person.name) {
                    prop.personName = pkg.person.name;
                    return false;
                }
                if (self.options['author']) {
                    prop.personName = self.options['author'];
                    return false;
                }
                return true;
            }
        });

        prompts.push({
            store: true,
            type: 'input',
            name: 'personEmail',
            message: 'And your email?',
            default: function (prop) {
                if (pkg && pkg.person && pkg.person.email) {
                    return pkg.person.email;
                }
                return self.personEmail;
            },
            when: function (prop) {
                if (pkg && pkg.person && pkg.person.email) {
                    prop.personEmail = pkg.person.email;
                    return false;
                }
                if (self.options['email']) {
                    prop.personEmail = self.options['email'];
                    return false;
                }
                return true;
            }
        });

        return this.prompt(prompts).then(function (prop) {
            if (prop.dizmoName === undefined) {
                if (pkg && pkg.name) {
                    prop.dizmoName = pkg.name;
                } else {
                    prop.dizmoName = self.options['name'];
                }
            }
            if (prop.dizmoDescription === undefined) {
                if (pkg && pkg.description) {
                    prop.dizmoDescription = pkg.description;
                } else {
                    prop.dizmoDescription = self.options['description'];
                }
            }
            if (prop.bundleId === undefined) {
                if (pkg && pkg.dizmo && pkg.dizmo.settings &&
                    pkg.dizmo.settings['bundle-identifier'])
                {
                    prop.bundleId = pkg.dizmo.settings['bundle-identifier'];
                } else {
                    prop.bundleId = self.options['bundle-id'];
                }
            }
            if (prop.personName === undefined) {
                if (pkg && pkg.person && pkg.person.name) {
                    prop.personName = pkg.person.name;
                } else {
                    prop.personName = self.options['author'];
                }
            }
            if (prop.personEmail === undefined) {
                if (pkg && pkg.person && pkg.person.email) {
                    prop.personEmail = pkg.person.email;
                } else {
                    prop.personEmail = self.options['email'];
                }
            }
            self.properties = lodash.assign(prop, {
                _: lodash
            });
        });
    }),

    configuring: function () {
        var bundle_id = path.parse(this.properties.bundleId);
        if (bundle_id && bundle_id.name) {
            this.config.set('domain', bundle_id.name);
        } else {
            this.config.set('domain', this._domain());
        }

        if (fs.existsSync('package.json')) {
            this.destinationRoot(process.cwd());
        } else if (this.options['git']) {
            this.destinationRoot(
                lodash.kebabCase(this.properties.dizmoName) + '.git');
        } else {
            this.destinationRoot(
                lodash.kebabCase(this.properties.dizmoName));
        }
        this.config.save();
    },

    writing: function () {
        this.fs.copy(
            this.templatePath('assets/'),
            this.destinationPath('assets/'));
        this.fs.copy(
            this.templatePath('gulp/'),
            this.destinationPath('gulp/'));
        this.fs.copy(
            this.templatePath('help/**/*.png'),
            this.destinationPath('help/'));
        this.fs.copyTpl(
            this.templatePath('help/**/*.md'),
            this.destinationPath('help/'), this.properties);
        this.fs.copy(
            this.templatePath('src/'),
            this.destinationPath('src/'));
        this.fs.copyTpl(
            this.templatePath('src/index.html'),
            this.destinationPath('src/index.html'), this.properties);
        this.fs.copy(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js'));
        this.fs.copy(
            this.templatePath('.eslintrc.json'),
            this.destinationPath('.eslintrc.json'));
        this.fs.copy(
            this.templatePath('.info.plist'),
            this.destinationPath('.info.plist'));
        this.fs.copyTpl(
            this.templatePath('LICENSE'),
            this.destinationPath('LICENSE'), lodash.assign(this.properties, {
                year: new Date().getFullYear()
            }));
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'), this.properties);
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'), this.properties);

        if (this.options.git || fs.existsSync('.gitignore')) {
            this.fs.copy(
                this.templatePath('.npmignore'),
                this.destinationPath('.gitignore'));
        } else {
            this.fs.copy(
                this.templatePath('.npmignore'),
                this.destinationPath('.npmignore'));
        }
    },

    install: function () {
        this.npmInstall([], {'cache-min': 604800, 'depth': 0});
    },

    end: function () {
        if (this.options['coffee-script']) {
            this.composeWith('dizmo:ext-coffee-script', {
                args: this.args, options: lodash.assign(this.options, {
                    force: true
                })
            });
        } else if (this.options['type-script']) {
            this.composeWith('dizmo:ext-type-script', {
                args: this.args, options: lodash.assign(this.options, {
                    force: true
                })
            });
        }
        this._git();
    },

    _git: function () {
        var git = shell.which('git');
        if (git && this.options.git) {
            this.spawnCommand(git.toString(), [
                'init', '--quiet', this.destinationPath()
            ]);
        }
    },

    _domain: function () {
        if (process.env.USER) {
            return 'me.' + process.env.USER;
        } else if (process.env.USERNAME) {
            return 'me.' + process.env.USERNAME;
        } else try {
            var base = path.parse(os.homedir()).base;
            if (base) {
                return 'me.' + base;
            } else {
                return 'my.domain';
            }
        } catch (_) {
            return 'my.domain';
        }
    }
});
