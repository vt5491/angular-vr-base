// 
// angular-vr-base generator
//  created 2015-10-30
//
// all the logic specific to installing vr into an angular app
// should be placed here.
//

'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

// helper methods go here
var AngVrBase = yeoman.generators.Base.extend({


});

//module.exports = yeoman.generators.Base.extend({
module.exports = AngVrBase.extend({
  _initGlobals: function (cb) {
    this.defaultArtifactNames = {};
    
    // services
    this.defaultArtifactNames.mainService = 'main';
    this.defaultArtifactNames.baseService = 'base';
    this.defaultArtifactNames.utilsService = 'utils';
    
    // controllers
    // note: main controller is gen'd by the angular generator, thus we comment it out
    // so we don't gen it again.
    //this.defaultArtifactNames.mainController = 'main';
    this.defaultArtifactNames.custController = 'cust';

    // directives
    this.defaultArtifactNames.canvasKeysDirective = 'canvas-keys';
    
    this.artifacts = {};
    this.artifacts.services = {};
    this.artifacts.controllers = {};
    this.artifacts.directives = {};
    
    // initialize service names
    this.artifacts.services.mainService = this.defaultArtifactNames.mainService;

    //this.log('_initGlobals: this.artifacts.services.mainService=' + this.artifacts.services.mainService);
    this.artifacts.services.base = this.defaultArtifactNames.baseService;
    this.artifacts.services.utils = this.defaultArtifactNames.utilsService;

    // initialize controller names
    this.artifacts.controllers.cust = this.defaultArtifactNames.custController;
    
    // initialize directive names
    this.artifacts.directives.canvasKeys = this.defaultArtifactNames.canvasKeysDirective;

    //TODO: make this customizable e.g via options
    this.skipInstall = true;
  },

  initializing: function () {
    this._initGlobals();

    //this.log('initializing: this.options=', this.options);
    //debugger;
    //this.log('initliazing: artifacts in options:' + ('artifacts' in this.options));
    //this.log('initializing: this.options.artifacts=', this.options.artifacts);
    // allow the user to override artifacts (useful for unit testing)
    // if ( 'artifacts' in this.options) {
    //   this.artifacts = this.options.artifacts;
    //   this.log('initializing: this.artifacts=',this.artifacts);
    // }
  },
  
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the super ' + chalk.red('AngularVrBase') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  createAngularServices: function () {
    console.log('subgeneratorServices: entered');
    console.log('subgeneratorServices: this.args=' + this.args);
    console.log('subgeneratorServices:  services.main= ' + this.artifacts.services.main);
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      console.log('subgeneratorServices:  key= ' + key);
      this.composeWith('angular:service',  {args: [ this.artifacts.services[key] ]} );
      
    }.bind(this));    
  },

  // helper method
  _markupFile: function (filePath) {
 // _injectTemplate: function (filePath) {
    var fileContents = this.fs.read(filePath);

    console.log('_markupFile: fileContents=' + fileContents);
    this.conflicter.force = true;

    // loop over each line looking for our insert point
    var lines = _.map(fileContents.split('\n'));

    var accumulateLines = function(str) {
      var result = '';

      // look for closing bracket, and insert our tag before this
      if (/^\s\s\}\);/.test(str)) {
        result +=  '<%= stuff %>' + '\n';   
      }
      result += str + '\n';

      return result;
      
    };

    // convert file string into an array of lines (including tagged line)
    var taggedLines = _.map(lines, accumulateLines);

    // convert the array back into a string so we can rewrite to the file
    fileContents = null;

    var strAccumulate = function(str) {
      fileContents += str;
    };

    _.map(taggedLines, strAccumulate);

    // and write it back
    this.fs.write(filePath, fileContents);
  },
  
  // insert tags into the base angular artifacts, so we can later inject our custom code
  markupArtifacts: function () {
    // services
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var filePath = this.destinationPath('app/scripts/services/' + [ this.artifacts.services[key] ] + '.js');
      console.log('markupArtifacts: filePath=' + filePath);
      this._markupFile(filePath);
    }.bind(this));
    
    // // controllers
    // Object.keys(this.artifacts.controllers).forEach( function (key, index, array) {
    //   var filePath = this.destinationPath('app/scripts/controllers/' + [ this.artifacts.controllers[key] ] + '.js');
    //   this._markupFile(filePath);
    // }.bind(this));

    // // directives
    // Object.keys(this.artifacts.directives).forEach( function (key, index, array) {
    //   var filePath = this.destinationPath('app/scripts/directives/' + [ this.artifacts.directives[key] ] + '.js');
    //   this._markupFile(filePath);
    // }.bind(this));
  },                                                 

  // inject partials into the template code
  partialsInjection: function () {

    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var templatePath = this.destinationPath('app/scripts/services/' + [ this.artifacts.services[key] ] + '.js');
      var partialsPath = this.templatePath('../partials/services/' + [ this.artifacts.services[key] ] + '.js');

      console.log('partialsInjection: tempaltePath=' + templatePath);
      console.log('partialsInjection: partialsPath=' + partialsPath);
      //debugger;
      var partialContents = this.fs.read(partialsPath);

      partialContents += new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\n';
      this.fs.copyTpl(
        templatePath,
        templatePath,
        { stuff: partialContents}
      );
      
    }.bind(this));    
  },

  //  Now we need to replace any tags in the partial.  Since
  // the files are already in place, we only need to do an in place
  // copy.  We'll achive this as part of the standard 'writing' step.
  writing: function () {
    console.log('sub-angular: now in writing, this.options.appName=', this.options.appName);
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var templatePath = this.destinationPath('app/scripts/services/' +
                                              [ this.artifacts.services[key] ] + '.js');

      this.fs.copyTpl(
        templatePath,
        templatePath, {
          name: key,
          appName: this.options.appName
        }
      );
    }.bind(this));
  },
  
  // install: function () {
  //   this.installDependencies();
  // }

  install: function () {
    this.log('base.install: skipInstall=' + this.skipInstall);
    if( !this.skipInstall) {
      this.log('base.install: now calling installDependencies');
      this.installDependencies();      
    };
  }
  
});
