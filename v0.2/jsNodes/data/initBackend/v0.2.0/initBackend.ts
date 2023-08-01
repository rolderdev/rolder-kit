import { NodeInstance } from "@noodl/noodl-sdk"
import init from "../../../../libs/kuzzle/v.0.1.0/init"

const Cookies = window.Cookies
const Ms = window.Ms

export default async function initBackend_v0_2_0(noodleNode: NodeInstance) {
    const { sessionTimeout, project, envVersion, debug } = window.Rolder
    const validateJWT = (sessionTimeout: string) => {
        const jwtExpireDiff: number = Cookies.get('jwtExpiresAt') - Date.now()
        if (jwtExpireDiff > 0) {
            const jwt = Cookies.get('jwt')
            Kuzzle.connect().then(() =>
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
            )
        } else noodleNode.sendSignalOnOutput('jwtValidationFailed')
    }

    if (debug > 1) console.time('Initialize performance')
    const Kuzzle = init({ project, envVersion })
    Kuzzle.connect().then(() => {
        window.Kuzzle = Kuzzle
        validateJWT(sessionTimeout)
        if (debug > 0) console.log('Kuzzle initialized: ' + project + '-' + envVersion)
        if (debug > 1) console.timeEnd('Initialize performance')
    }).catch((error: any) => {
        console.error(error.message)
    })
}