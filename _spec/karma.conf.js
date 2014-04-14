// Karma configuration
// Generated on Wed Oct 09 2013 19:20:49 GMT+0800 (中国标准时间)

module.exports = function(config) {
    var base_path = '../';
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        base_path+'lib/jquery-1.11.0.min.js',
        base_path+'ufinder.config.js',
        base_path+'_src/core/ufinder.js',
        base_path+'_src/core/ufinder.*.js',
        base_path+'_src/core/class.js',
        base_path+'_src/core/utils.js',
        base_path+'_src/core/finder.js',
        base_path+'_src/core/finder.*.js',
        base_path+'_src/core/selection.js',
        base_path+'_src/core/datatree.js',
        base_path+'_src/core/request.js',
        base_path+'_src/core/uploader.js',
        base_path+'_src/core/proxy.js',
        base_path+'_src/adapter/*.js',
        base_path+'_spec/tools/js/UserAction.js',
//        './spec/karmaConfig.js',
        base_path+'_spec/SpecHelper.js',
        base_path+'_spec/core/*.js'
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
    browsers: ['Firefox','Chrome'],//,'Chrome'


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
    //coverage
      reporters: ['progress', 'coverage','junit'],
          preprocessors: {
//        '../_src/core/*.js': ['coverage']
              '../_src/core/finder.js': ['coverage'],
              '../_src/adapter/adapter.js': ['coverage']

          }
      ,
    coverageReporter: {
          type: 'text',
          dir: './coverage/json_files/'
    }
//      ,
//      junitReporter: {
//          outputFile: 'test-results.xml'
//      }
  });
};
