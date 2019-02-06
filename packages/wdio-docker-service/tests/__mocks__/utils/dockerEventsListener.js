import EventEmitter from 'events'

module.exports = class DockerEventsListenerMock extends EventEmitter {
    connect() {
        process.nextTick(() => {
            this.emit('message', 'test')
        })
    }

    disconnect() {}
}
