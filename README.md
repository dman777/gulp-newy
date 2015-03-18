###gulp-newy
Gulp plugin which determines if source file is newer than destination file

##Usage

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

## Examples
Compare css `less` files in `~/github/foo/app/css/*.less` against `~/github/foo/compiled/css/application.css`

```javascript 
function lessVersusOneFile(projectDir, srcFile, absSrcFile) {
    var destDir = "compiled";
    var compareFileAgainst = "compiled/css/application.css";

    var destination = path.join(projectDir, compareFileAgainst);
    // distination returned will be /home/one/github/foo/compiled/css/application.css
    return destination;
}
// all *.less files will be compared against
// home/one/github/load-balancer-service/compiled/css/application.css

gulp.task('compileLessToCss', function () {
    return gulp.src(srcPath + '/css/**/*.less')
        .pipe(newy(lessVersusOneFile))
        .pipe(less())
        .pipe(gulp.dest(compilePath + '/css'));
```

