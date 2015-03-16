var chai = require('chai');
var spy = require('chai-spies');
var File = require('vinyl');
var newy = require('../lib/newy');
var mock = require('mock-fs');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
//var rewire = require("rewire");
//var myModule = rewire("./test.js");
var sandbox;

chai.should();
chai.use(sinonChai);

describe('gulp-newy', function() {
  var fs = require('fs');
    var fakeFile, pspy;

    beforeEach(function() {
        //myModule.__set__('__dirname', "/home/one");
        mock({
            __dirname: mock.directory({
                mode: 0755,
                items: {
                file1: 'file one content',
                file2: new Buffer([8, 6, 7, 5, 3, 0, 9])
                }
            })
        });

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
        it('it should console out to show foo is newer than bar',
            function(done) {
               var bar = function(dest) { return 'bar' };
               spy1 = sandbox.spy(console, "log");
               stream = newy(bar);
               stream.write(fakeFile);
               spy1.should.have.been.calledThrice;
               done();
        });

        it('it should emit a data event because foo is newer than bar', 
            function(done) {
               var bar = function(dest) { return 'bar' };
               stream = newy(bar);
               stream.write(fakeFile);
               spyEvent = sandbox.spy();
               stream.on('data', spyEvent);
               spyEvent.should.have.been.called;
               done();
            });

        it('it should NOT console out since foo is not newer than foo',
            function(done) {
               var bar = function(dest) { return 'foo' };
               spy1 = sandbox.spy(console, "log");
               stream = newy(bar);
               stream.write(fakeFile);
               spy1.should.not.have.been.calledThrice;
               done();
        });
        it('it should NOT emit a data event because foo is NOT newer than foo', 
            function(done) {
               var bar = function(dest) { return 'foo' };
               stream = newy(bar);
               stream.write(fakeFile);
               spyEvent = sandbox.spy();
               stream.on('data', spyEvent);
               spyEvent.should.not.have.been.called;
               done();
            });
    });
});
