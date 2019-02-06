import Docker from '../src/utils/docker'
import DockerLauncher from '../src/launcher'

jest.mock('../src/utils/dockerEventsListener', () => {
    return require('./__mocks__/utils/dockerEventsListener')
})

describe('DockerLauncher', () => {
    let launcher

    beforeEach(() => {
        jest.spyOn(DockerLauncher.prototype, '_redirectLogStream').mockResolvedValue()
        launcher = new DockerLauncher()
    })

    afterEach(function() {
        DockerLauncher.prototype._redirectLogStream.mockRestore()
    })

    describe('#constructor', () => {
        test('must initialize class properties', () => {
            expect(launcher.docker).toBe(null)
            expect(launcher.dockerLogs).toBe(null)
            expect(launcher.logToStdout).toBe(false)
        })
    })

    describe('#onPrepare', () => {
        describe('@dockerOptions', () => {
            describe('when dockerOptions.image is not provided', () => {
                const dockerOptions = {}
                test('must reject with error', () => {
                    return launcher.onPrepare({ dockerOptions })
                        .catch((err) => {
                            expect(err instanceof Error).toBe(true)
                            expect(err.message).toBe('dockerOptions.image is a required property')
                        })
                })
            })

            describe('when dockerOptions.image is provided', () => {
                test('must run docker', async () => {
                    const dockerOptions = {
                        image: 'my-image'
                    }

                    await launcher.onPrepare({ dockerOptions })
                    expect(launcher.docker instanceof Docker).toBe(true)
                    expect(launcher.docker.image).toBe('my-image')
                })
            })

            describe('when dockerOptions.args is provided', () => {
                test('must run docker with args', async () => {
                    const dockerOptions = {
                        image: 'my-image',
                        args: '-foo'
                    }

                    await launcher.onPrepare({ dockerOptions })
                    expect(launcher.docker.args).toBe('-foo')
                })
            })

            describe('when dockerOptions.command is provided', () => {
                test('must run docker with command', async () => {
                    const dockerOptions = {
                        image: 'my-image',
                        command: '/bin/bash'
                    }

                    await launcher.onPrepare({ dockerOptions })
                    expect(launcher.docker.command).toBe('/bin/bash')
                })
            })

            describe('when dockerOptions.healthCheck is provided', () => {
                test('must run docker with healthCheck', async () => {
                    const dockerOptions = {
                        image: 'my-image',
                        healthCheck: 'http://localhost:8000'
                    }

                    await launcher.onPrepare({ dockerOptions })
                    expect(launcher.docker.healthCheck).toEqual({ url: 'http://localhost:8000' })
                })
            })

            describe('when dockerOptions.options are provided', () => {
                test('must run docker with options', async () => {
                    const dockerOptions = {
                        image: 'my-image',
                        options: {
                            e: ['TEST=ME']
                        }
                    }

                    await launcher.onPrepare({ dockerOptions })
                    expect(launcher.docker.options).toEqual({
                        rm: true,
                        e: ['TEST=ME'],
                        cidfile: launcher.docker.cidfile
                    })
                })
            })
        })

        describe('@dockerLogs', () => {
            describe('when not set', () => {
                test('must not redirect log stream', async () => {
                    const config = {
                        dockerOptions: {
                            image: 'my-image'
                        }
                    }

                    await launcher.onPrepare(config)
                    expect(DockerLauncher.prototype._redirectLogStream).not.toHaveBeenCalled()
                })
            })

            describe('when set to string', () => {
                test('must redirect log stream', async () => {
                    const config = {
                        dockerLogs: './',
                        dockerOptions: {
                            image: 'my-image'
                        }
                    }

                    await launcher.onPrepare(config)
                    launcher.docker.emit('processCreated')
                    expect(DockerLauncher.prototype._redirectLogStream).toHaveBeenCalled()
                })
            })
        })

        describe('@onDockerReady', () => {
            describe('when onDockerReady is provided', () => {
                const config = {
                    onDockerReady: jest.fn(),
                    dockerOptions: {
                        image: 'my-image'
                    }
                }

                beforeEach(() => {
                    jest.spyOn(Docker.prototype, 'run').mockResolvedValue(true)
                })

                afterEach(function() {
                    Docker.prototype.run.mockRestore()
                })

                test('must call onDockerReady', async () => {
                    await launcher.onPrepare(config)
                    expect(config.onDockerReady).toHaveBeenCalled()
                })
            })

            describe('when docker run is rejected', () => {
                const config = {
                    onDockerReady: jest.fn(),
                    dockerOptions: {
                        image: 'my-image'
                    }
                }

                beforeEach(() => {
                    jest.spyOn(Docker.prototype, 'run').mockRejectedValue(new Error('Fail'))
                })

                afterEach(function() {
                    Docker.prototype.run.mockRestore()
                })

                test('must NOT call onDockerReady', async () => {
                    await launcher.onPrepare(config)
                    expect(config.onDockerReady).not.toHaveBeenCalled()
                })
            })
        })

        describe('@debug', () => {
            describe('when set to true', () => {
                test('must set docker debug to true', async () => {
                    const config = {
                        debug: true,
                        dockerOptions: {
                            image: 'my-image'
                        }
                    }

                    await launcher.onPrepare(config)
                    expect(launcher.docker.debug).toBe(true)
                })
            })

            describe('when set to false', () => {
                test('must set docker debug to false', async () => {
                    const config = {
                        debug: false,
                        dockerOptions: {
                            image: 'my-image'
                        }
                    }

                    await launcher.onPrepare(config)
                    expect(launcher.docker.debug).toBe(false)
                })
            })
        })
    })

    describe('#onComplete', () => {
        describe('when this.docker is present', () => {
            const config = {
                debug: false,
                dockerOptions: {
                    image: 'my-image'
                }
            }

            beforeEach(function() {
                jest.spyOn(Docker.prototype, 'stop')
            })

            afterEach(function() {
                Docker.prototype.stop.mockRestore()
            })

            test('must call this.docker.stop', async () => {
                await launcher.onPrepare(config)
                launcher.onComplete()
                expect(launcher.docker.stop).toHaveBeenCalled()
            })
        })
    })
})
