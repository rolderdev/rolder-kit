import init from '../../libs/kuzzle/v0.0.6/init'
const initBackend = async () => {
    const { backendType, project, envVersion, debug } = Rolder
    switch (backendType) {
        case 'kuzzle':
            const Kuzzle = init({ project, envVersion })
            try {
                await Kuzzle.connect()
                window.Kuzzle = Kuzzle
                if (debug > 0) console.log('Kuzzle initialized: ' + project + '-' + envVersion)
            } catch (error) {
                console.error(error.message)
            }
            break
    }
}

export default async function node(noodleNode) {
    const { sessionTimeout, debug } = Rolder
    const validateJWT = (sessionTimeout) => {
        const jwtExpireDiff = cookies.get('jwtExpiresAt') - Date.now()
        if (jwtExpireDiff > 0) {
            const jwt = cookies.get('jwt')
            Kuzzle.connect()
            Kuzzle.auth.checkToken(jwt).then((response) => {
                if (response.valid) {
                    // restore jwt
                    Kuzzle.jwt = jwt
                    noodleNode.sendSignalOnOutput('jwtValidationSucceed')
                    // update jwt
                    Kuzzle.auth.refreshToken({ sessionTimeout }).then((response) => {
                        cookies.set('jwt', response.jwt, { expires: 30 })
                        cookies.set('jwtExpiresAt', Date.now() + ms(sessionTimeout), { expires: 30 })
                    })
                } else noodleNode.sendSignalOnOutput('jwtValidationFailed')
            })
        } else noodleNode.sendSignalOnOutput('jwtValidationFailed')
    }

    if (debug > 1) console.time('Initialize performance')

    initBackend().then(() => {
        validateJWT(sessionTimeout)
        if (debug > 1) console.timeEnd('Initialize performance')
    })
}