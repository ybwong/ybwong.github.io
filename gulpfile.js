var gulp = require('gulp');
var debug = require('gulp-debug');
var path = require('path');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var del = require('del');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var reload = browserSync.reload;

var CWD = path.resolve('.');
// var API_SPEC = path.resolve(CWD, '../api/api.raml');
// var API_DEST = path.resolve(CWD, '../server/static/docs/api');
var API_SPEC = '../src/raml/**/*.raml';
var API_DEST = '../api-docs/';
var API_HTML = function(path) {
  path.dirname = '';
  path.extname = ".html"
};
var minifiedJsFileName = 'if.min.js';

function raml2html(options) {
  var gutil = require('gulp-util');
  var through = require('through2');
  var raml2html = require('raml2html');

  var simplifyMark = function(mark) {
    if (mark) mark.buffer = mark.buffer.split('\n', mark.line + 1)[mark.line].trim();
  }

  options = options || {};

  switch (options.type) {
    case 'json':
      var Q = require('q');
      options.config = {
        processRamlObj: function(raml) {
          return Q.fcall(function() {
            return JSON.stringify(raml, options.replacer, 'indent' in options ? options.indent : 2);
          })
        }
      };
      break;
    case 'yaml':
      var Q = require('q');
      var yaml = require('js-yaml');
      options.config = {
        processRamlObj: function(raml) {
          return Q.fcall(function() {
            return yaml.safeDump(raml, {
              skipInvalid: true,
              indent: options.indent,
              flowLevel: options.flowLevel
            });
          })
        }
      };
      break;
    default:
      options.type = 'html';
      options.config = options.config || raml2html.getDefaultConfig(options.template, options.templatePath);
  }

  var stream = through.obj(function(file, enc, done) {
    var fail = function(message) {
      done(new gutil.PluginError('raml2html', message));
    };
    if (file.isBuffer()) {
      var cwd = process.cwd();
      process.chdir(path.resolve(path.dirname(file.path)));
      raml2html.render(file.contents, options.config).then(
        function(output) {
          process.chdir(cwd);
          stream.push(new gutil.File({
            base: file.base,
            cwd: file.cwd,
            path: gutil.replaceExtension(file.path, options.extension || '.' + options.type),
            contents: new Buffer(output)
          }));
          done();
        },
        function(error) {
          process.chdir(cwd);
          simplifyMark(error.context_mark);
          simplifyMark(error.problem_mark);
          process.nextTick(function() {
            fail(JSON.stringify(error, null, 2));
          });
        });
    } else if (file.isStream()) fail('Streams are not supported: ' + file.inspect());
    else if (file.isNull()) fail('Input file is null: ' + file.inspect());
  });

  return stream;
}

function logErrorAndQuit(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('apidoc', function() {
  var rename = require('gulp-rename');

  return gulp.src(API_SPEC)
    .pipe(raml2html())
    .on('error', logErrorAndQuit)
    .pipe(rename(API_HTML))
    .pipe(gulp.dest(API_DEST));
});

gulp.task('apijson', function() {
  return gulp.src(API_SPEC)
    .pipe(raml2html({
      type: 'json'
    }))
    .on('error', logErrorAndQuit)
    .pipe(gulp.dest(API_DEST));
});

gulp.task('apiyaml', function() {
  return gulp.src(API_SPEC)
    .pipe(raml2html({
      type: 'yaml'
    }))
    .on('error', logErrorAndQuit)
    .pipe(gulp.dest(API_DEST));
});

gulp.task('apilint', function() {
  var raml = require('gulp-raml');
  // Fails on Windows, until https://github.com/JohanObrink/gulp-raml/issues/4 is resolved.

  return gulp.src(API_SPEC)
    .pipe(raml())
    .pipe(raml.reporter('default'))
    .pipe(raml.reporter('fail'));
});

gulp.task('clean', function(cb) {
  del([API_DEST, '../*.html', '../js', '../images', '../styles'], cb);
});


gulp.task('distclean', function() {
  return del(['./dist/**/*'], {
    force: true
  });
});

gulp.task('devclean', function() {
  return del(['./dev/**/*'], {
    force: true
  });
});


gulp.task('styles', function() {
  var injectAppFiles = gulp.src('../src/styles/*.scss', {
    read: false
  });
  var injectGlobalFiles = gulp.src('../src/global/*.scss', {
    read: false
  });

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src('../src/scss/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(debug({
      title: 'unicorn:'
    }))
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('../styles'));
});

gulp.task('devstyles', function() {
  var injectAppFiles = gulp.src('./src/styles/*.scss', {
    read: false
  });
  var injectGlobalFiles = gulp.src('./src/global/*.scss', {
    read: false
  });

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src('./src/scss/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('./dev/styles'));
});

gulp.task('html', ['apidoc', 'styles', 'js', 'images'], function() {
  var injectFiles = gulp.src(['../styles/*.css',
    '../js/*.js'
  ]);

  var injectOptions = {
    // addRootSlash: false,
    addRootSlash: true,
    ignorePath: ['../']
  };

  return gulp.src('../src/**/*.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(wiredep())
    .pipe(gulp.dest('../'));
});

gulp.task('devhtml', ['apidoc', 'devstyles', 'devjs', 'devimages', 'devfonts'], function() {
  var injectFiles = gulp.src(['./dev/styles/*.css',
    './dev/js/*.js', './dev/site/**/*.js'
  ]);

  var injectOptions = {
    // addRootSlash: false,
    // addRootSlash: true,
    ignorePath: ['../dev'],
    relative: true
  };

  return gulp.src('./src/**/*.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(wiredep({
      fileTypes: {
        html: {
          replace: {
            js: function(filePath) {
              var path = filePath.replace('../bower_components/', '');
              return '<script src="' + path + '"></script>';
            },
            css: function(filePath) {
              var path = filePath.replace('../bower_components/', '');
              return '<link rel="stylesheet" href="' + path + '"/>';
            }
          }
        }
      }

    }))
    .pipe(gulp.dest('./dev/'));

});


gulp.task('minjs', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe(concat(minifiedJsFileName))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('js', ['minjs'], function() {
  return gulp.src(['bower_components/**/*.min.js'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('devjs', function() {
  return gulp.src(['./src/**/*.js', 'bower_components/**/*.js'])
    .pipe(gulp.dest('./dev'));
});

gulp.task('images', function() {
  return gulp.src('../src/images/*.png')
    .pipe(gulp.dest('../images'));
});

gulp.task('devimages', function() {
  return gulp.src('./src/images/*.png')
    .pipe(gulp.dest('./dev/images'));
});

gulp.task('devfonts', function() {
  return gulp.src('./bower_components/bootstrap-sass/assets/fonts/**/*')
    .pipe(gulp.dest('./dev/fonts'));
});

// Watch files for changes & reload
gulp.task('serve', ['html'], function() {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['../']
  });

  gulp.watch(['../src/**/*.html'], ['html', reload]);
  gulp.watch(['../src/**/*.png'], ['images', reload]);
  gulp.watch(['../src/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['../src/global/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['../src/**/*.js'], ['js', reload]);
  gulp.watch(['../src/api/**/*.{raml,json,txt}'], ['apidoc', reload]);
});

gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js', '!./src/**/*.min.js', '!./src/**/min.*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('dev', ['devhtml'], function() {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['./dev/']
  });

  gulp.watch(['./src/**/*.html'], ['devhtml', reload]);
  gulp.watch(['./src/**/*.png'], ['devimages', reload]);
  gulp.watch(['./src/styles/**/*.{scss,css}'], ['devstyles', reload]);
  gulp.watch(['./src/global/**/*.{scss,css}'], ['devstyles', reload]);
  gulp.watch(['./src/**/*.js'], ['devjs', reload]);
  gulp.watch(['./src/api/**/*.{raml,json,txt}'], ['apidoc', reload]);
});


gulp.task('default', ['apidoc', 'styles', 'js', 'images', 'html', 'serve'], function() {});
