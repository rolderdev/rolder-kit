import validateJwt from "../../../../../libs/dataService/2_back/auth/v0.2.0/validateJwt"
import init from "../../../../../libs/dataService/2_back/init/v0.2.0/init"
import { NodeInstance } from "../../../../../main/getNodes/v0.5.0/types"
import { sendOutput, sendSignal } from "../../../../../main/ports/send/v0.3.0/send"
import conLog from "../../../../../utils/debug/conLog/v0.1.0/conLog"

const signals = {
  init: (node: NodeInstance) => {
    const { project, envVersion } = window.Rolder
    conLog(`Initialize performance`, 'time')

    const Kuzzle = init(project, envVersion)
    Kuzzle.connect().then(() => {
      window.Kuzzle = Kuzzle
      validateJwt().then((jwtValid) => {
        if (jwtValid) {
          Kuzzle?.auth.getCurrentUser().then((r: any) => {
            sendOutput(node, 'userRole', r.content.role?.value)
            sendSignal(node, 'jwtValidationSucceed')
          })
        } else sendSignal(node, 'jwtValidationFailed')
        sendSignal(node, 'inited')

        conLog(`Initialize performance`, 'timeEnd')
        conLog([`Kuzzle initialized:`, `${project}-${envVersion}`])
      })
    })
  }
}

export default signals