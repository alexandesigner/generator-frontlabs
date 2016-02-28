'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var taskRunners;
var styleLang;
var userInterface;

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
      'Welcome, let\'s generate a ' + chalk.blue('frontlabs') + ' A front-end labs generator that helps you build fast an modern web and mobile apps.'
    ));

    // Questions
    var prompts = [{
      name: 'appName',
      message: 'What is your app\'s name ?',
      default: 'frontlabs',
    },
    {
      type: 'list',
      name: 'taskRunner',
      message: 'Would you like to use a Task-Runner for compiling?',
      choices: [
        {
          name: 'Gulp',
          value: 'gulp'
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
      name: 'chooseui',
      message: 'Would you like to use a Framework?',
      choices: [
        {
          name: 'UIKit',
          value: 'uikit'
        },
        {
          name: 'Bootstrap',
          value: 'bootstrap'
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

      this.appName               = props.appName;
      userInterface                = props.chooseui;
      taskRunners                  = props.taskRunner;
      styleLang                        = props.styleLang;

      this.useGulp                  = false;
      this.useUIKit                 = false;
      this.useBootstrap       = false;
      this.useFoundation    = false;
      this.Scss                         = false;
      this.Less                         = false;

      function wantsTaskrunner(tr) {
        return taskRunners && taskRunners.indexOf(tr) !== -1;
      }
      function wantsFramework(fw) {
        return userInterface && userInterface.indexOf(fw) !== -1;
      }
      function wantsStyleLang(sl) {
        return styleLang && styleLang.indexOf(sl) !== -1;
      }

      // Task Runner Compiling
      this.useGulp = wantsTaskrunner('gulp');

      // Framework
      this.useUIKit =  wantsFramework('uikit');
      this.useBootstrap  = wantsFramework('bootstrap');
      this.useFoundation =  wantsFramework('foundation');

      // Styles
      this.Scss = wantsStyleLang('Scss');
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
          useUIKit: this.useUIKit,
          useBootstrap: this.useBootstrap,
          useFoundation: this.useFoundation,
          Scss: this.Scss,
          Less: this.Less
      };
      this.template('_bower.json', 'bower.json', context);
    },

    // Files
    projectfiles: function () {

      // Context Files
      var context = {
        appname: this.appName,
        useUIKit: this.useUIKit,
        useBootstrap: this.useBootstrap,
        useFoundation: this.useFoundation,
        appName: this.appName,
        Scss: this.Scss,
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

      // Use Gulp
      if (this.useGulp) {
        this.template("_gulpfile.js", "gulpfile.js", context);
      }

      // Create directories
      mkdirp('app');
      mkdirp('app/src');

      // Scripts
      this.fs.copy(
        this.templatePath('app/_js'),
        this.destinationPath('app/js')
      );

      // Styles
      this.directory(
        this.templatePath('app/_css'),
        this.destinationPath('app/css')
      );

      if (this.Scss) {
        mkdirp('app/src/scss');
        this.template('app/_src/scss', 'app/src/scss', context);
        this.directory(
          this.templatePath('app/_src/_scss'),
          this.destinationPath('app/src/scss')
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
      if(taskRunners != 'none') {
        this.log(yosay(
          'Yeah! You\'re all set and done!' +
          ' Now simply run ' + chalk.blue.italic('\''+taskRunners+'\'') + ' and start coding!'
        ));
        this.spawnCommand('gulp');
      }
    });

  }

});
