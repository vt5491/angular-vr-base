//
// test-angular-vr-base
//
// unit test for the generator 'angular-br-base'
//
// created 2015-10-30
//

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var generators = require('yeoman-generator').generators;
var os = require('os');

// describe('angular-vr-base:app', function () {
//   before(function (done) {
//     helpers.run(path.join(__dirname, '../generators/app'))
//       .withOptions({ skipInstall: true })
//       .withPrompts({ someOption: true })
//       .on('end', done);
//   });

//   it('creates files', function () {
//     assert.file([
//       // 'bower.json',
//       // 'package.json',
//       // '.editorconfig',
//       // '.jshintrc'
//       'app/scripts/services/main.js'
//     ]);
//   });
// });



// this will be the end to end test
describe('angular-vr-base:app end to end', function () {

//   var vrBaseSubAngularGenerator;
//   // we want to create a real 'vr-base:sub-angular' so we can
//   // unit test methods in there.
//   // We also need to create a 
//   // mock 'angular-service' since 'vr-base:sub-angular' calls
//   // on it to create services and such.
   before(function (done) {

//     // create a mock angular generator
    var angularServiceDummy = generators.Base.extend({
      
      initializing: function () {
        //console.log('now in initializing');
        // write a line to simulate ending of an angular service
        var fn = 'app/scripts/services/' + this.args + '.js';
        console.log('dummy: fn=' + fn);
        this.fs.write(fn, '//dummy-line\n  });\n');
      },
    });
    
//     // create a real 'angular-vr-base:app' generator, so we can test individual
       // methods (hooked off the run context) in our 'it' tests
    var artifacts = {};
    artifacts.services = {};
    
    artifacts.services.main = 'main';
    artifacts.services.base = 'base';

    this.angVrBaseAppRunContext = helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true,
                     name: 'def',
                     artifacts: artifacts,
                   })
      .withArguments(['defg' ])
      .withGenerators([ [angularServiceDummy, 'angular:service'] ])
      .on('end', done);


  });

  it('creates service files', function () {
    //console.log('do_something= ' + this.vrBaseDependentSubAngularRunContext.do_something());
    //console.log('this.vrBaseSubAngularRunContext.cwd=', this.vrBaseSubAngularRunContext.options.env.cwd);
    //console.log('do_something= ' + this.vrBaseDependentSubAngularGenerator.do_something());
    assert.file([
      'app/scripts/services/main.js',
      'app/scripts/services/base.js',
    ]);

  });
    
});

describe('angular-vr-base:individual methods', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      };

    var artifacts = {};
      
    artifacts.services = {};
    
    artifacts.services.main = 'main';
    artifacts.services.base = 'base';
      
    this.angularVrBaseGenerator = helpers.createGenerator('angular-vr-base:app', [
      '../../generators/app',
      ],
      null,
     {'artifacts': artifacts}
    );

    
    // we need to do this to properly feed in options and args
    this.angularVrBaseGenerator.initializing();

    // override the artifacts hash
    this.angularVrBaseGenerator.artifacts = artifacts;

    // angularVrBaseGenerator.sourceRoot(path.join(process.cwd(), 'test/temp') );
    // angularVrBaseGenerator.options.env.cwd = path.join(process.cwd(), 'test/temp');
    
    this.angularVrBaseGenerator.fs.write('file.txt', '//dummy-line\n  });\n');

    this.angularVrBaseGenerator.fs.write('app/scripts/services/main.js', '//dummy-line\n  });\n');
    this.angularVrBaseGenerator.fs.write('app/scripts/services/base.js', '//dummy-line\n  });\n');
      
    //console.log('describe:before: angularVrBaseGenerator=', this.angularVrBaseGenerator);
//     subAngularGenerator = helpers.createGenerator(
//       '../../generators/app',
// //      'vr-base:sub-angular',
//       [
//         path.join(__dirname, '../generators/sub-angular')
//         //'../generators/sub-angular'
//       ],null, {abc: 7, def: 8, artifacts: artifacts})
//       //.inTmpDir()
//       ;

    done();
   }.bind(this));
  }//.on('end', done)
  );

  it('_initGlobals works', function(){
    var result = this.angularVrBaseGenerator._initGlobals();

    //console.log('result =' + result);
    //console.log('this.angularVrBase.artifacts.services.mainService' + this.angularVrBase.artifacts.services.mainService);
    //assert.equal(this.angularVrBase.artifacts.services.mainService, this.angularVrBase.defaultArtifactNames.mainService + '.js');
    assert.equal(this.angularVrBaseGenerator.artifacts.services.mainService, this.angularVrBaseGenerator.defaultArtifactNames.mainService);
  });

  it('artifacts transformation pipeline', function () {
    var result;

    
    // markup artifacts
    this.angularVrBaseGenerator.markupArtifacts();

    result = this.angularVrBaseGenerator.fs.read('app/scripts/services/base.js');

    var regex = /\<\%\= stuff \%\>/;
    
    assert(regex.test(result));

    // partials injection
    this.angularVrBaseGenerator.partialsInjection();

    result = this.angularVrBaseGenerator.fs.read('app/scripts/services/base.js');
    //console.log('result after partialsInjection=' + result);
    var regex = /\<\%\= name \%\>/;
    
    assert(regex.test(result));

    // template Interpolation
    this.angularVrBaseGenerator.writing();

    result = this.angularVrBaseGenerator.fs.read('app/scripts/services/base.js');
    console.log('result after writing=' + result);
    var regex = /base\.js base/;
    
    assert(regex.test(result));

  });
  

});




