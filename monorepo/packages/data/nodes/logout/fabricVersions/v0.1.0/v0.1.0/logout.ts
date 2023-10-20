import { sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default {
  signals: {
    logout: (noodlNode: NoodlNode) => {
      window.R.libs.Kuzzle.auth.logout().then(() => sendSignal(noodlNode, 'loggedOut'))
    }
  }
}