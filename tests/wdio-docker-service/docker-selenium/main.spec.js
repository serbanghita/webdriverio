import assert from 'assert'
import fs from 'fs'
import path from 'path'

describe('when using Docker to run Selenium', function() {
    it('should run a test', async function() {
        await browser.url('/')
        const title = await browser.getTitle()

        assert.equal(title, 'WebdriverIO · Next-gen WebDriver test framework for Node.js')
    })

    it('should have created a log file', function() {
        const filePath = path.join(process.cwd(), 'docker-log.txt')
        const file = fs.statSync(filePath)
        assert(file.size > 0)
    })
})
