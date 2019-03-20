var through2 = require('through2');
var fs = require("fs");
var path = require('path');
var colors = require('colors');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;


// check for missing directory 
function checkMissingDir(destinationFile) {
  var filePath = path.dirname(destinationFile);
  return transversePath(filePath);
}

function transversePath(filePath) {
    var pathBuild = path.normalize(filePath);
    var error = false;
    if (!tryStatSync(pathBuild)) {
        while (true) {
            error = true;
            var parentDirPath = path.dirname(pathBuild);
            if (parentDirPath == pathBuild) {
                // we are at the top level dir, dirname won't reduce either "C:\\" or "/"
                break;
            }
            if (tryStatSync(parentDirPath)) {
                break;
            }
            pathBuild = parentDirPath;
        }
    }
    if (error) {
        return pathBuild;
    } else { return false; }

    function tryStatSync(path) {
        try {
            fs.statSync(path);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}

function consoleWarn(missingDir) {
    console.log("-------------------- Newy Message ------------------" .magenta);
    console.log("Warning - missing directory:" .bold .red);
    console.log(missingDir .bold .red);
    console.log("----------------------------------------------------" .magenta);
}

/////////////////////////////////////

function errorCheckArg(args) {
  if (typeof(args[0]) !== 'function') {
      throw new PluginError('gulp-newy',
        "This plugin requires a callback function, Jack!");
  }
}

function errorCheckPath(absDestFile) {
  var isAbsolute = path.isAbsolute(String(absDestFile));
  if (!isAbsolute) {
      throw new PluginError('gulp-newy',
        "The file destination path returned from your callback " +
        "function is relative. Please make it a absolute path '/': \n-> " +
        absDestFile);
  }
}

// main code
function constructDestwCallBack(absSrcFile, callback) {
    var projectDir = path.resolve(__dirname, "../../../");
    var srcFile = path.basename(absSrcFile);
    var destinationFile = callback(projectDir, srcFile, absSrcFile);
    errorCheckPath(destinationFile);

    if (fs.existsSync(destinationFile)) {
        return destinationFile;
    } else {
        var directoryMissing = checkMissingDir(destinationFile);
        if (directoryMissing) {
          consoleWarn(directoryMissing);
        }
        return false;
    }
}


function compareFileTimes(destinationFile, srcFile) {
    destinationFile = fs.statSync(destinationFile).mtime;
    srcFile = fs.statSync(srcFile).mtime;
    return (srcFile > destinationFile); 
}

function newy(callback) {
    var destinationFile;
    errorCheckArg(arguments);
    return through2.obj(function(file, enc, next) {
        var pipeFileThrough = true;
        var streamObject = file.clone();
        var absSrcFile = streamObject.history[0];

        var destinationFile = constructDestwCallBack(absSrcFile, callback);
        if (destinationFile) {
            pipeFileThrough = compareFileTimes(destinationFile, absSrcFile);
        }
        if (pipeFileThrough) {
            //have file pipe silently if
            //destination file is missing - don't show file is newer msg
            if (destinationFile) {
              consoleOut(absSrcFile, destinationFile);
            }
            this.push(streamObject);
        }
        next();
    });
}

function consoleOut(absSrcFile, destinationFile) {
    console.log("-------------------- Newy Message ------------------" .magenta);
    console.log("File " .magenta + path.basename(absSrcFile) .white + 
      " is new/newer then " .magenta +
      path.basename(String(destinationFile)) .white);
    console.log("----------------------------------------------------" .magenta);
}

module.exports = newy;

