var gulp = require('gulp');
const { readFileSync, writeFileSync } = require('fs');
var path = require('path');
var runSequence = require('run-sequence');
var i18next = require('i18next-parser');
var converter = require('i18next-conv');
var config = require('./app/config.lang.js');

// MAIN TASKS

gulp.task('extract', function(){
  return runSequence('jsParse', 'json2po');
});

gulp.task('compile', function(){
  gulp.start('po2json');
});

// HELPER TASKS

gulp.task('jsParse', function(){
  return gulp.src(['*.js', '*.jsx', 'app/**/*.js', 'app/**/*.jsx'])
      .pipe(i18next({
          locales: config.SUPPORTED_LANGUAGES.map(lang => lang.code),
          functions: ['t'],
          attributes: ['data-i18n', 'i18nKey'],
          keySeparator: '^^^^^',
          namespaceSeparator: '~~~~~',
          output: path.resolve(__dirname, 'app', 'locales')
      }))
      .pipe(gulp.dest('app/locales'));
});

gulp.task('json2po', function(){

  config.SUPPORTED_LANGUAGES.forEach(function(lang){
    var source = path.resolve(__dirname, `app/locales/${lang.code}/translation.json`);
    var target = path.resolve(__dirname, `app/locales/${lang.code}/translation.po`);
    var options = {quiet : true};

    converter.i18nextToPo(lang.code, readFileSync(source), options).then(result => {
      writeFileSync(target, result);
      console.log(`Conversion of ${lang.code} done`);
    });
  });
});

gulp.task('po2json', function(){

  config.SUPPORTED_LANGUAGES.forEach(function(lang){
    var source = path.resolve(__dirname, `app/locales/${lang.code}/translation.po`);
    var target = path.resolve(__dirname, `app/locales/${lang.code}/translation.json`);
    var options = {quiet : true};

    converter.gettextToI18next(lang.code, readFileSync(source), options).then(result => {
      writeFileSync(target, result);
      console.log(`Conversion of ${lang.code} done`);
    });
  });
});
