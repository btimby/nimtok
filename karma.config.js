module.exports = (config) => {
  config.set({
    basePath: '.',
    frameworks: ['webpack', 'mocha', 'chai'],
    files: [
      'tests/**/test_*.js',
    ],
    preprocessors: {
      'tests/**/test_*.js': ['webpack'],
    },
    webpack: {

    },
    reporters: ['coverage', 'progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: [
      'ChromeHeadless',
      'Firefox',
    ],
    autoWatch: false,
    concurrency: Infinity,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
        displayName: 'FirefoxHeadless',
      },
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
        displayName: 'ChromeHeadlessNoSandbox',
      },
    },
    coverageReporter: {
      dir: '.coverage',
      type: 'html',
    },
  });
};
