import { JsVersions, getJsNode, getPorts } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/notification'

const jsVersions: JsVersions = {
    'v0.2.0': {
        inputs: getPorts('input', ['send', 'title', 'message', 'autoClose', 'autoCloseTimeout', 'color']),
        signals: v0_2_0.signals
    }
}

export default getJsNode('notification', jsVersions, 'purple')