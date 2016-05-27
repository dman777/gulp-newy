var chai = require('chai');
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
            foo: mock.file({
            content: 'nothing',
            mtime: new Date(Date.now())
            }),
            bar: mock.file({
            content: 'nothing',
            mtime: new Date(1,1)
            })
        });
        
        fakeFile = new File({
           contents: new Buffer('foo'),
           history: ['foo']
        });
        

        sandbox = sinon.sandbox.create();

    });

    afterEach(function() {
        mock.restore();
        sandbox.restore();
    });

    describe('get files', function() {
        it('it should console out to show file foo is newer than file bar',
            function(done) {
               var bar = function(dest) { return 'bar' };
               var spy1 = sandbox.spy(console, "log");
               var stream = newy(bar);
               stream.write(fakeFile);
               spy1.should.have.been.calledThrice;
               done();
        });

        it('it should emit a data event because file foo is newer than file bar',
            function(done) {
               var bar = function(dest) { return 'bar' };
               var stream = newy(bar);
               stream.write(fakeFile);
               var spyEvent = sandbox.spy();
               stream.on('data', spyEvent);
               spyEvent.should.have.been.called;
               done();
        });

        it('it should NOT console out since file foo is not newer than file foo',
            function(done) {
               var bar = function(dest) { return 'foo' };
               var spy1 = sandbox.spy(console, "log");
               var stream = newy(bar);
               stream.write(fakeFile);
               spy1.should.not.have.been.calledThrice;
               done();
        });
        it('it should NOT emit a data event because file foo is NOT' +
           ' newer than file foo', 
            function(done) {
               var bar = function(dest) { return 'foo' };
               var stream = newy(bar);
               stream.write(fakeFile);
               var spyEvent = sandbox.spy();
               stream.on('data', spyEvent);
               spyEvent.should.not.have.been.called;
               done();
        });
    });
});
