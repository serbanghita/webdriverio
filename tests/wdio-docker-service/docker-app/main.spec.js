import assert from 'assert'
import fs from 'fs'
import path from 'path'

describe('when using Docker to run application', function() {
    it('should run a test', async function() {
        browser.url('/')
        const title = await browser.getTitle()
        assert.equal(title, 'Welcome to wdio-docker-service')
    })

    it('should have created a log file', function() {
        const filePath = path.join(process.cwd(), 'docker-log.txt')
        const file = fs.statSync(filePath)
        assert(file.size > 0)
    })
})
