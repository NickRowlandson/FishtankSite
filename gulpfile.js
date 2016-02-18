(function() {

  var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    autoprefix = require('gulp-autoprefixer'),
    webserver = require('gulp-webserver'),
    install = require('gulp-install'),
    ngAnnotate = require('gulp-ng-annotate'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    beautify = require('gulp-beautify'),
    gulpIgnore = require('gulp-ignore'),
    ngConstant = require('gulp-ng-constant'),
    argv = require('yargs').argv,
    coffee = require('gulp-coffee'),
    sourcemaps = require('gulp-sourcemaps'),
    inject = require('gulp-inject'),
    strinject = require('gulp-inject-string'),
    filenames = require('gulp-filenames'),
    haml = require('gulp-haml'),
    debug = require('gulp-debug');

  var environment = argv.env || 'development';
  var NORMAL_FILE_TYPES = ['**/*.html', '**/*.css', '**/*.js', '**/*.json', '!**/index.html', '!**/config/development.json', '!**/config/production.json'];

  // > gulp install-libraries
  // Task installs the bower and npm library dependencies
  gulp.task('install-libraries', ['compile'], function() {
    gulp.src(['./bower.json', './package.json'])
      .pipe(install());
  });

  // > gulp index
  // Task creates the index.html file by injecting the javascript and css files dynamically
  gulp.task('index', ['style', 'coffee', 'generate-config', 'convert-haml', 'move-normal'], function() {
    var target = gulp.src('index.html', {
      cwd: './src/'
    });

    //Had to put a timeout in here, as the src wasn't finding the files before they were made
    setTimeout(function() {
      var sources = gulp.src([
        "./bower_components/jquery/dist/jquery.js",
        "./bower_components/bootstrap/dist/js/bootstrap.js",
        "./bower_components/angular/angular.js",
        "./bower_components/angular-route/angular-route.js",
        "./bower_components/angular-local-storage/dist/angular-local-storage.js",
        "./app/components/**/*.js",
        "./app/factories/**/*.js",
        "./app/services/**/*.js",
        "./app/config/**/*.js",
        "./app/app.js",
        "./app/assets/css/app.css",
        "./bower_components/bootstrap/dist/css/bootstrap.css"
      ], {
        read: false
      });

      return target.pipe(inject(sources))
        .pipe(strinject.after('</head>',
          "\n\n<!-- ########################################################################################## -->\n" +
          "<!-- NOTE: THIS IS COMPILED. DO NOT MODIFY THIS FILE. SEE '/src/index.html' instead! :) -->\n" +
          "<!-- ########################################################################################## -->"))
        .pipe(gulp.dest('./'));
    }, 500);
  });

  // > gulp style
  // Task autoprefixes and compiles sass stylesheets.
  gulp.task('style', function() {
    gulp.src('**/*.scss', {
        cwd: './src/'
      })
      .pipe(concat('app.scss'))
      .pipe(sass().on('error', function(err) {
        console.log("SASS ERROR: " + err.message);
      }))
      .pipe(cssnano())
      .pipe(autoprefix())
      .pipe(gulp.dest('./app/assets/css'));
  });

  // > gulp coffee
  // Compiles the coffeescript
  gulp.task('coffee', function() {
    gulp.src('**/*.coffee', {
        cwd: './src/'
      })
      .pipe(sourcemaps.init())
      .pipe(coffee({
        bare: true
      })).on('error', function(e) {
        console.log("Coffeescript build error: ", e);
      })
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./app'));
  });

  // > gulp find-html
  // Used only by convert-haml as a dependency
  // Task gets the haml file list in the src components for conversion
  gulp.task('find-haml', function() {
    return gulp.src('**/*.haml', {
        cwd: "./src/"
      })
      .pipe(filenames("haml_files"))
  });

  // > gulp convert-haml
  // Task converts haml to html and then transfers the created html files to their respective app sub folder
  gulp.task('convert-haml', ['find-haml'], function() {
    var files = filenames.get("haml_files", "full")
    return gulp.src(files, {
        base: './src/'
      })
      .pipe(haml())
      .pipe(gulp.dest('./app/'));
  });

  // > gulp find-files
  // Finds normal css, js, html files for moving to app
  gulp.task('find-normal-files', function() {
    return gulp.src(NORMAL_FILE_TYPES, {
        cwd: "./src/"
      })
      .pipe(filenames("normal_files"))
  });

  // > gulp move-normal
  // Moves normal files from src over to app (if you wanna develop in raw html, css or js)
  gulp.task('move-normal', ['find-normal-files'], function() {
    var files = filenames.get("normal_files", "full")
    return gulp.src(files, {
        base: './src/'
      })
      .pipe(gulp.dest('./app/'));
  });

  // > gulp watch-sass
  // Task watches for scss changes and trigger style task.
  gulp.task('watch-sass', function() {
    gulp.watch('**/*.scss', {
      cwd: "./src/"
    }, ['style']);
  });

  // > gulp watch-coffee
  // Task watches for coffeescript changes and triggers the coffee task.
  gulp.task('watch-coffee', function() {
    gulp.watch('**/*.coffee', {
      cwd: "./src/"
    }, ['index', 'coffee']);
  });

  // > gulp watch-haml
  // Task watches for html changes and copies the changed file to the app folder for use.
  gulp.task('watch-haml', function() {
    gulp.watch('**/*.haml', {
      cwd: "./src/"
    }, ['convert-haml'])
  });

  // > gulp watch-index
  // Task watches for index.html changes under the src folder and rerenders it
  gulp.task('watch-index', function() {
    gulp.watch('index.html', {
      cwd: "./src/"
    }, ['index'])
  });

  // > gulp watch-normal
  // Task watches for html, css or js changes under the src folder
  gulp.task('watch-normal', function() {
    gulp.watch(NORMAL_FILE_TYPES, {
      cwd: "./src/"
    }, ['move-normal'])
  });

  // > gulp webserver
  // Task starts a livereload webserver.
  gulp.task('webserver', ['compile', 'index'], function() {
    gulp.src('./')
      .pipe(webserver({
        livereload: true,
        fallback: 'index.html',
        open: true
      }));
  });


  // > gulp compress
  //  # Dependencies ['install-libraries']
  //Task compresses all the JS files into one file
  gulp.task('compress', function() {
    var fileList = [
      //Components
      './app/components/**',
      //Factories
      './app/factories/**',
      //Services
      './app/services/**',
      //Config
      './app/config/config.js',
      //mainApp
      './app/app.js'
    ];

    return gulp.src(fileList)
      .pipe(gulpIgnore.exclude('*.html'))
      .pipe(sourcemaps.init())
      .pipe(concat('concat.js'))
      .pipe(rename('app.min.js'))
      .pipe(ngAnnotate())
      .pipe(uglify({
        mangle: true
      }))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('app'));
  });

  // > gulp generateConfig
  // Task that generates the config file depending on environment (production or development)
  gulp.task('generate-config', function() {
    return gulp.src('config/' + environment + '.json', {
        cwd: './src/'
      })
      .pipe(ngConstant({
        name: 'environmentVariables',
        templatePath: './src/config/tpls/constant.tpl.ejs',
        space: '',
        constants: {
          env: environment
        }
      }))
      .pipe(rename('config.js'))
      .pipe(beautify({
        indentSize: 2
      }))
      .pipe(gulp.dest('./app/config'))
      .on('error', function() {
        console.log('build error');
      });
  });

  // > gulp compile
  // Task used to manually compile stylesheets, coffeescript and move over html and generate index.html
  gulp.task('compile', ['style', 'coffee', 'index', 'generate-config', 'convert-haml', 'move-normal']);

  // > gulp
  // Default task that does almost everything.
  gulp.task('default', ['compile', 'watch-sass', 'watch-coffee', 'watch-haml', 'watch-normal', 'watch-index', 'webserver']);
}());
