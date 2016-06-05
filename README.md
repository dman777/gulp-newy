[![Build Status](https://travis-ci.org/dman777/gulp-newy.svg?branch=master)](https://travis-ci.org/dman777/gulp-newy)

[Visit gulp-newy.com for screen shots, examples, and more](http://www.gulp-newy.com/#/home)

### Install
```
$ npm install --save-dev gulp-newy
```
![alt text](https://raw.githubusercontent.com/dman777/icons/master/gulp-newy.jpg)

### Usage
###### Using a single callback function, you have complete control. 
```javascript
var newy = require('gulp-newy');

newy(function(projectDir, srcFile, absSrcFile) {
    
   // Newy hands you the project directory, source file,
   // and source file with aboslute path as the args.
   
   // You can build, construct, and mutate the absolute 
   // path and filename with the args. 
   // Return your new destination file with absolute path. 

   // Cut and paste callback function in examples for ease.
})
```
### Result
```
-------------------- Newy Message ------------------
File [source filename] is new/newer then [destination filename returned from your callback]
----------------------------------------------------
```
### Example Callback Functions
-------------------------------------------------------------------------
###### Many to one comparison
Compare `less` files in `/home/one/github/foo/app/css/*.less` against single file `/home/one/github/foo/compiled/css/application.css`

```javascript 
var newy = require('gulp-newy');
var path = require('path');

function lessVersusOneFile(projectDir, srcFile, absSrcFile) {
    // Newy gives projectDir arg wich is '/home/one/github/foo/`
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
###### One to one comparison
Compare `coffee` script files in `/home/one/github/foo/app/js/*.coffee` against
compiled `Javascript` files in `/home/one/github/foo/compiled/js/*.js`
* note: child directories and files will be globed with no issues

```javascript 
var newy = require('gulp-newy');
var path = require('path');

function coffeeVersusJs(projectDir, srcFile, absSrcFile) {
    // newy gives projectDir arg wich is '/home/one/github/foo/`
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
### FAQs
* It's ok if directory in the absolute path doesn't exist, but newy will let you know as a courtesy warning in case it was unintentional. 
* If there is no destination file, newy will automatically count file as new and pipe it through as any other file that is newer.
* Always be sure to return the destination file with a absolute path, not a relative path. `projectDir` is given to you for this.  

### Notes
* Why doesn't gulp-newy use options instead of a callback? 
  Because 'one size does not fit all'. I have found with other modules of the same type I was restricted and could not do what I needed.
* Why aren't you using batch style operations? 
  Think about this stream as a gas pump filling your car....do you want a steady stream or do you want a bottle neck of operation end results all released at once which will still end up a steady stream? 
* Why aren't you using node `process.nextTick` or `setImmediate` for async-like behavior? 
  The majority of operations here are I/O operations. This means they are natively non-blocking. Using these apis   would only gaurantee that each job runs next in the event queue...which is unnecessary. If you really wanted to set this behavior, it can be done in the gulp wraped task. 
* What does all this mean? A code free of overhead software gives you less issues and bugs. Think of food that is orgranic and more healthy.  

###### available at [![alt text](https://raw.githubusercontent.com/dman777/icons/master/npm.jpg)](https://www.npmjs.com/package/gulp-newy)


