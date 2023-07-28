import { NodeInstance } from "@noodl/noodl-sdk"
import init from "../../../libs/kuzzle/v.0.1.0/init"

const Rolder = window.Rolder
const Cookies = window.Cookies
const Kuzzle = window.Kuzzle
const Ms = window.Ms

const initBackend = async () => {
    const { project, envVersion, debug } = Rolder
    const Kuzzle = init({ project, envVersion })
    try {
        await Kuzzle.connect()
        window.Kuzzle = Kuzzle
        if (debug > 0) console.log('Kuzzle initialized: ' + project + '-' + envVersion)
    } catch (error: any) {
        console.error(error.message)
    }
}

export default async function initBackend_v0_2_0(noodleNode: NodeInstance) {
    const { sessionTimeout, debug } = Rolder
    const validateJWT = (sessionTimeout: string) => {
        const jwtExpireDiff: number = <any>Cookies.get('jwtExpiresAt') - Date.now()
        if (jwtExpireDiff > 0) {
            const jwt = Cookies.get('jwt')
            Kuzzle.connect()
            Kuzzle.auth.checkToken(jwt).then((response: any) => {
                if (response.valid) {
                    // restore jwt
                    Kuzzle.jwt = jwt
                    noodleNode.sendSignalOnOutput('jwtValidationSucceed')
                    // update jwts
                    Kuzzle.auth.refreshToken({ sessionTimeout }).then((response: any) => {
                        Cookies.set('jwt', response.jwt, { expires: 30 })
                        Cookies.set('jwtExpiresAt', Date.now() + Ms(sessionTimeout), { expires: 30 })
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