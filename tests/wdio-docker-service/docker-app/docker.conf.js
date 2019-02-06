const path = require('path')

exports.config = {
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu']
        }
    }],

    specs: [],
    deprecationWarnings: true,
    bail: 0,
    baseUrl: 'http://localhost:8080',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    logLevel: 'silent',
    framework: 'mocha',

    reporters: ['spec'],
    services: ['selenium-standalone', 'docker'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 10000,
        compilers: ['js:@babel/register']
    },

    dockerLogs: './',
    dockerOptions: {
        image: 'nginx',
        healthCheck: 'http://localhost:8080',
        options: {
            p: ['8080:8080'],
            v: [
                `${path.join(__dirname, '/app')}:/usr/share/nginx/html:ro`,
                `${path.join(__dirname, '/nginx.conf')}:/etc/nginx/nginx.conf:ro`
            ]
        }
    }
}
