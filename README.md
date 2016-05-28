[![Build Status](https://travis-ci.org/dman777/gulp-newy.svg?branch=master)](https://travis-ci.org/dman777/gulp-newy)


###### available at [![alt text](https://raw.githubusercontent.com/dman777/icons/master/npm.jpg)](https://www.npmjs.com/package/gulp-newy)

#### gulp-newy
Gulp plugin which determines if source file is newer than destination file. Using a single callback function, you have complete control. 

![alt text](https://raw.githubusercontent.com/dman777/icons/master/gulp-newy.jpg)

### Usage

```javascript
var newy = require('gulp-newy');

newy(function(projectDir, srcFile, absSrcFile) {
    // do your logic here to set and return the destination 
    // file which to compare against.
    
   // newy hands you the project directory, source file,
   // and source file with aboslute path as the args in the
   // call back function.
   
   // cut and paste callback function in examples for ease
})
```
### Result
```
-------------------- Newy Message ------------------
File [source filename] is new/newer then [destination filename returned from your callback]
----------------------------------------------------
```
### Troubleshooting and Faqs
* If you get a `false` in `File [source filename] is new/newer then false`, this will be because there is a missing directory in the destination filename path. Double check the value that is being returned in your callback function.  
* If there is no destination file, Newy will automatically count file as new and pipe it through as any other file that is newer. This is only when all directories exist. Newy can not create new directories. 

### Example Callback Functions
-------------------------------------------------------------------------
Compare `less` files in `/home/one/github/foo/app/css/*.less` against single file `/home/one/github/foo/compiled/css/application.css`

```javascript 
var newy = require('gulp-newy');
var path = require('path');

function lessVersusOneFile(projectDir, srcFile, absSrcFile) {
    //newy gives projectDir arg wich is '/home/one/github/foo/`
    var compareFileAgainst = "compiled/css/application.css";

    var destinationFile = path.join(projectDir, compareFileAgainst);
    // distinationFile returned will be /home/one/github/foo/compiled/css/application.css
    return destinationFile;
}
// all *.less files will be compared against
// /home/one/github/foo/compiled/css/application.css

gulp.task('compileLessToCss', function () {
    return gulp.src('app/css/**/*.less')
        .pipe(newy(lessVersusOneFile))
        .pipe(less())
        .pipe(gulp.dest('compiled/css'));
});
```
-------------------------------------------------------------------------
Compare `coffee` script files in `/home/one/github/foo/app/js/*.coffee` against
compiled `Javascript` files in `/home/one/github/foo/compiled/js/*.js`
* note: child directories and files will be globed with no issues

```javascript 
var newy = require('gulp-newy');
var path = require('path');

function coffeeVersusJs(projectDir, srcFile, absSrcFile) {
    var stripPath = "app";
    var destDir = "compiled/js";
    var newSuffix = ".js"

    var re = new RegExp("^\/.*"+stripPath+"\/");
    var relativeSourceFile = absSrcFile.replace(re, "");
    var destinationFile = path.join(projectDir, destDir, relativeSourceFile);
    destinationFile = destination.substr(0, destination.lastIndexOf(".")) + newSuffix;
    // srcFile is error.service.coffee
    // destination file returned is 
    // /home/one/github/foo/compiled/js/fooBar/services/error-services/error.service.js
    return destinationFile;
}

gulp.task('compile-coffee', function () {
    return gulp.src('app/js/**/*.coffee')
          .pipe(newy(coffeeVersusJs))
          .pipe(coffee({bare: true}))
          .pipe(gulp.dest('compiled/js'));
});
```
---------------------------------------------------------------------------------------
### Notes
* Why doesn't gulp-newy use options instead of a callback? 
  Because 'one size does not fit all'. I have found with other modules of the same type I was restricted and could not do what I needed.
* Why doesn't this module use promises?
  Promises are simply not needed in this case and to use them adds unnecessary overhead.
* Why aren't you using batch style operations? 
  Think about this stream as a gas pump filling your car....do you want a steady stream or do you want a bottle neck of operation end results all released at once which will still end up a steady stream? 
* Why aren't you using node `process.nextTick` or `setImmediate` for async-like behavior? 
  The majority of operations here are I/O operations. This means they are natively non-blocking. Using these apis   would only gaurantee that each job runs next in the event queue...which is unnecessary. If you really wanted to set this behavior, it can be done in the gulp wraped task. 
* What does all this mean? A code free of overhead software gives you less issues and bugs. Think of food that is orgranic and more healthy.  

