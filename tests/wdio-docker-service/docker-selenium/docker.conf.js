exports.config = {
    host: 'localhost',
    specs: [],
    runner: 'local',
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu']
        }
    }],

    logLevel: 'silent',
    baseUrl: 'http://webdriver.io',

    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        compilers: ['js:@babel/register']
    },
    reporters: ['spec'],
    services: [
        'docker'
    ],
    dockerLogs: './',
    dockerOptions: {
        image: 'selenium/standalone-chrome',
        healthCheck: 'http://localhost:4444',
        options: {
            p: ['4444:4444'],
            shmSize: '2g'
        }
    }
}
