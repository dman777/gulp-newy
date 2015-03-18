####gulp-newy
Gulp plugin which determines if source file is newer than destination file

###Usage

```javascript
var newy = require('gulp-newy');

newy(function(projectDir, srcFile, absSrcFile) {
    // do your logic here to set the destination 
    // file which to compare against.
    
   // newy hands you the project directory, source file,
   // and source file with aboslute path as the args in the
   // call back function.
   
   // cut and paste callback function in examples for ease
})
```

### Example Callback Functions
-------------------------------------------------------------------------
Compare `less` files in `/home/one/github/foo/app/css/*.less` against `/home/one/github/foo/compiled/css/application.css`

```javascript 
function lessVersusOneFile(projectDir, srcFile, absSrcFile) {
    //newy gives projectDir arg wich is '/home/one/github/foo/`
    var compareFileAgainst = "compiled/css/application.css";

    var destination = path.join(projectDir, compareFileAgainst);
    // distination returned will be /home/one/github/foo/compiled/css/application.css
    return destination;
}
// all *.less files will be compared against
// /home/one/github/foo/compiled/css/application.css

gulp.task('compileLessToCss', function () {
    return gulp.src('app/css/**/*.less')
        .pipe(newy(lessVersusOneFile))
        .pipe(less())
        .pipe(gulp.dest('compiled/css'));
```
------------------------------------------------------------------------
Compare `coffee` script files in `/home/one/github/foo/app/js/*.coffee` against
compiled `Javascript` files in `/home/one/github/foo/compiled/js/*.js`
* note: child directories and files will be globed with no issues

```javascript 
function coffeeVersusJs(projectDir, srcFile, absSrcFile) {
    var stripPath = "app";
    var destDir = "compiled";
    var newSuffix = ".js"

    var re = new RegExp("^\/.*"+stripPath+"\/");
    var relativeSourceFile = absSrcFile.replace(re, "");
    var destination = path.join(projectDir, destDir, relativeSourceFile);
    destination = destination.substr(0, destination.lastIndexOf(".")) + newSuffix;
    return destination;
}
