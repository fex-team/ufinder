// Karma configuration
// Generated on Wed Oct 09 2013 19:20:49 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        './jquery-1.11.0.min.js',
        './ufinder.config.js',
        './_src/core/ufinder.js',
        './_src/core/ufinder.*.js',
        './_src/core/class.js',
        './_src/core/utils.js',
        './_src/core/finder.js',
        './_src/core/finder.*.js',
        './_src/core/selection.js',
        './_src/core/datatree.js',
        './_src/core/request.js',
        './_src/core/uploader.js',
        './_src/core/proxy.js',
        './_src/adapter/*.js',
        './_spec/tools/js/UserAction.js',
//        './spec/karmaConfig.js',
        './_spec/SpecHelper.js',
        './_spec/core/*.js'
//        ,'./spec/graphic/*.js'
    ],


    // list of files to exclude
    exclude: [
        'karma.conf.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
//    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
    //coverage
//    reporters: ['progress', 'coverage'],

      reporters: ['progress', 'coverage','junit'],
          preprocessors: {
        './_src/core/*.js': ['coverage']
          },
    coverageReporter: {
          type: 'html',
          dir: './_spec/'
    }
      ,
      junitReporter: {
          outputFile: 'test-results.xml'
      }
  });
};
