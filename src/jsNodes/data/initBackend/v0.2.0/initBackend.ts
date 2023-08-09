import { NodeInstance } from "@noodl/noodl-sdk"
import init from "../../../../libs/kuzzle/v.0.1.0/init"
import validateJwt from "../../../../libs/validateJwt/v0.1.0/validateJwt"

export default async function initBackend_v0_2_0(noodleNode: NodeInstance) {
    const { project, envVersion, debug } = window.Rolder
    
    if (debug > 1) console.time('Initialize performance')
    const Kuzzle = init({ project, envVersion })
    Kuzzle.connect().then(() => {
        window.Kuzzle = Kuzzle
        if (debug > 0) console.log('Kuzzle initialized: ' + project + '-' + envVersion)
        if (debug > 1) console.timeEnd('Initialize performance')
        validateJwt().then((jwtValid) => {
            if (jwtValid) noodleNode.sendSignalOnOutput('jwtValidationSucceed')
            else noodleNode.sendSignalOnOutput('jwtValidationFailed')
        })
    }).catch((error: any) => {
        console.error(error.message)
    })
}