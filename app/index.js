'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var styleLang;
var userInterface;
var frameworkJS;

module.exports = yeoman.generators.Base.extend({

  // Initialize method
  initialize: function(){
    this.pkg = require('../package.json');
  },

  // Prompting before initialize scaffold
  prompting: function () {
    var done = this.async();

    // Have greet the user.
    this.log(yosay(
      'Welcome a ' + chalk.yellow('Front-End Labs') + ' the generator that helps you build fast an modern web and mobile apps.'
    ));

    // Questions
    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name ?',
      default: 'appName',
    },
    {
      type: 'list',
      name: 'frameworkJS',
      message: 'Would you like to use a Framework?',
      choices: [
        {
          name: 'Angular',
          value: 'angular'
        },
        {
          name: 'None',
          value: 'none'
        }
      ]
    },
    {
      type: 'list',
      name: 'styleLang',
      message: 'Which precompiler-language do you want to use?',
      choices: [
        {
          name: 'SCSS',
          value: 'Scss'
        },
        {
          name: 'SASS',
          value: 'sass'
        },
        {
          name: 'less',
          value: 'Less'
        },
        {
          name: 'None',
          value: 'none'
        }
      ]
    },
    {
      type: 'list',
      name: 'userInterface',
      message: 'Would you like to use a User Interface (Boilerplate)?',
      choices: [
        {
          name: 'Bootstrap',
          value: 'bootstrap'
        },
        {
          name: 'UIKit',
          value: 'uikit'
        },
        {
          name: 'Foundation',
          value: 'foundation'
        },
        {
          name: 'None',
          value: 'none'
        }
      ]
    }];

    // Arguments Prompt
    this.prompt(prompts, function (props) {

      this.appName = props.appName;
      frameworkJS = props.frameworkJS;
      userInterface = props.userInterface;
      styleLang = props.styleLang;

      this.useAngular = false;

      this.useUIKit = false;
      this.useBootstrap = false;
      this.useFoundation = false;
      this.Scss = false;
      this.SASS = false;
      this.Less = false;

      function wantsFramework(fw) {
        return frameworkJS && frameworkJS.indexOf(fw) !== -1;
      }
      function wantsUserInterface(ui) {
        return userInterface && userInterface.indexOf(ui) !== -1;
      }
      function wantsStyleLang(sl) {
        return styleLang && styleLang.indexOf(sl) !== -1;
      }

      // FrameworkJS
      this.useAngular = wantsFramework('angular');

      // User Interface
      this.useUIKit =  wantsUserInterface('uikit');
      this.useBootstrap  = wantsUserInterface('bootstrap');
      this.useFoundation =  wantsUserInterface('foundation');

      // Styles
      this.Scss = wantsStyleLang('Scss');
      this.SASS = wantsStyleLang('SASS');
      this.Less = wantsStyleLang('Less');

      done();
    }.bind(this));
  },

  writing: {

    // packageJSON
    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    // App Context
    app: function () {
      var context = {
          useAngular: this.useAngular,
          useUIKit: this.useUIKit,
          useBootstrap: this.useBootstrap,
          useFoundation: this.useFoundation,
          Scss: this.Scss,
          SASS: this.SASS,
          Less: this.Less
      };
      this.template('_bower.json', 'bower.json', context);
    },

    // Files
    projectfiles: function () {

      // Context Files
      var context = {
        appname: this.appName,
        useAngular: this.useAngular,
        useUIKit: this.useUIKit,
        useBootstrap: this.useBootstrap,
        useFoundation: this.useFoundation,
        Scss: this.Scss,
        SASS: this.SASS,
        Less: this.Less
      };

      // Editor Config
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );

      // JSHint validate u javascript code
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );

      // Bower dependencies
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );

      // Gulpfile
      this.template('_gulpfile.js', 'gulpfile.js', context);

      // Create directories
      mkdirp('app');
      mkdirp('app/src');

      // Use Angular
      if (this.useAngular) {
          this.template('app/_js/_controllers/controllers.js', 'app/js/controllers/controllers.js', context);
          this.template('app/_js/_directives/directives.js', 'app/js/directives/directives.js', context);
          this.template('app/_js/_filters/filters.js', 'app/js/filters/filters.js', context);
          this.template('app/_js/_models/models.js', 'app/js/models/models.js', context);
          this.template('app/_js/_services/services.js', 'app/js/services/services.js', context);
          this.template('app/_js/_app.js', 'app/js/app.js', context);
          this.template('app/_public/templates.js', 'app/public/templates.js', context);
          this.directory(
            this.templatePath('app/_js/_templates'),
            this.destinationPath('app/js/templates')
          );
      }

      // Styles
      this.directory(
        this.templatePath('app/_css'),
        this.destinationPath('app/css')
      );

      if (!this.Scss || this.SASS || this.Less) {
        this.template('app/_css/styles.css', 'app/css/styles.css', context);
      };

      // SCSS
      if (this.Scss) {
        mkdirp('app/src/scss');
        this.template('app/_src/scss', 'app/src/scss', context);
        this.directory(
          this.templatePath('app/_src/scss'),
          this.destinationPath('app/src/scss')
        );
      }

      // SASS
      if (this.SASS) {
        mkdirp('app/src/sass');
        this.template('app/_src/sass', 'app/src/sass', context);
        this.directory(
          this.templatePath('app/_src/_sass'),
          this.destinationPath('app/src/sass')
        );
      }

      // Less
      if (this.Less) {
        mkdirp('app/src/less');
        this.template('app/_src/less', 'app/src/less', context);
        this.directory(
          this.templatePath('app/_src/_less'),
          this.destinationPath('app/src/less')
        );
      }

      // Images
      this.directory(
        this.templatePath('app/_images'),
        this.destinationPath('app/images')
      );

      // Fonts
      this.directory(
        this.templatePath('app/_fonts'),
        this.destinationPath('app/fonts')
      );

      // Scripts
      if (!this.useAngular) {
        this.template("app/_js/_scripts.js", "app/js/scripts.js", context);
      }

      // HTML
      this.template("_index.html", "index.html", context);
    },
  },

  // Run command install
  install: function () {

    this.installDependencies({
      skipInstall: this.options['skip-install']
    });

    this.on('end', function () {
      this.log(yosay(
        'Yeah! You\'re all set and done!' +
        ' Now simply run and start coding!'
      ));
      this.spawnCommand('gulp');
    });

  }

});
