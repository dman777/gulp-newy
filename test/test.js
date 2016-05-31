var chai = require('chai');
var assert = require('chai').assert;
var expect = chai.expect;
var spy = require('chai-spies');
var File = require('vinyl');
var newy = require('../lib/newy');
var mock = require('mock-fs');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var sandbox;

chai.should();
chai.use(sinonChai);

describe('gulp-newy', function() {
  var fs = require('fs');
    var fakeFile, pspy;

    beforeEach(function() {
        mock({
            '/home/one/foo': mock.file({
            content: 'nothing',
            mtime: new Date(Date.now())
            }),
            '/bar': mock.file({
            content: 'nothing',
            mtime: new Date(1,1)
            })
        });
        
        fakeFile = new File({
           contents: new Buffer('foo'),
           history: ['/home/one/foo']
        });
        

        sandbox = sinon.sandbox.create();

    });

    afterEach(function() {
        mock.restore();
        sandbox.restore();
    });

    describe('when dest file is newer than source file', function() {
      var bar;
      beforeEach(function() {
        bar = function(dest) { return '/bar' };
      });
      it('should console out to show file foo is newer than file bar',
          function(done) {
            var spy1 = sandbox.spy(console, "log");
            var stream = newy(bar);
            stream.write(fakeFile);
            spy1.should.have.been.calledThrice;
            done();
      });

      it('should emit a data event because file foo is newer than file bar',
          function(done) {
            var stream = newy(bar);
            stream.write(fakeFile);
            var spyEvent = sandbox.spy();
            stream.on('data', spyEvent);
            spyEvent.should.have.been.called;
            done();
      });
    });
    
    // note: I am compareing foo against foo instead of foo against bar. 
    // same logic tested file vs file
    describe('when dest file is not newer than source file', function() {
      var bar;
      beforeEach(function() {
        bar = function(dest) { return '/home/one/foo' };
      });
      it('should NOT console out since file foo is not newer than file foo',
          function(done) {
            var spy1 = sandbox.spy(console, "log");
            var stream = newy(bar);
            stream.write(fakeFile);
            spy1.should.not.have.been.calledThrice;
            done();
      });
      it('should NOT emit a data event because file foo is NOT' +
         ' newer than file foo', 
          function(done) {
            var stream = newy(bar);
            stream.write(fakeFile);
            var spyEvent = sandbox.spy();
            stream.on('data', spyEvent);
            spyEvent.should.not.have.been.called;
            done();
      });
    });

    describe('when destination file path is missing a directory', function() {
      var bar;
      beforeEach(function() {
        bar = function(dest) { return '/home/cats/foo' };
      });
      it('should give warning of missing directory',
        function(done) {
          var spy1 = sandbox.spy(console, "log");
          var stream = newy(bar);
          stream.write(fakeFile);
          spy1.should.have.been.called;
          spy1.should.have.been.calledWithMatch("Warning - missing directory:");
          spy1.should.have.been.calledWithMatch("/home/cats");
          done();
      });
      it('should count non existant file as new and emit a data event',
          function(done) {
            var stream = newy(bar);
            stream.write(fakeFile);
            var spyEvent = sandbox.spy();
            stream.on('data', spyEvent);
            spyEvent.should.have.been.called;
            done();
      });
    });

    describe('when a callback is not given', function() {
      it('should error',
        function(done) {
          var err;
          try {
            newy();
          } catch(error) {
            var err = error;
          }
          expect(err).to.exist;
          expect(err.message).to.contain('requires a callback function');
          done();
      });
    });

    describe('when the destination path is not absolute', function() {
      var foobar = function() { return 'home/cats/foo' };
      it('should error', function(done) {
        var err;
        try {
          var stream = newy(foobar);
          stream.write(fakeFile);
        } catch(error) {
          var err = error;
        }
        expect(err).to.exist;
        expect(err.message).to.contain('The file destination path');
        done();
      });
    });
});
