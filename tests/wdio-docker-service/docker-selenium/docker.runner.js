import fs from 'fs'
import path from 'path'

import Launcher from '../../../packages/wdio-cli/src/launcher.js'

const launcher = new Launcher(
    path.resolve(__dirname, 'docker.conf.js'),
    { spec: [path.resolve(__dirname, 'main.spec.js')] }
)

launcher.run().then((isFailing) => {
    if (!isFailing) {
        // eslint-disable-next-line no-console
        console.log('Docker App tests successful')
        process.exit(0)
    }

    const logFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith('.log'))
    for (const fileName of logFiles) {
        // eslint-disable-next-line no-console
        console.log(`\n========== LOG OUPUT ${fileName}`)
        // eslint-disable-next-line no-console
        console.log(fs.readFileSync(path.resolve(__dirname, fileName)).toString())
    }
    process.exit(1)
}, (e) => {
    // eslint-disable-next-line no-console
    console.error(`Docker App tests fail: ${e.stack}`)
})
