import { getCustomEnumType, getPort } from '@rk/port'
import { CompVersions, reactNode } from '@rk/node'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const compVersions: CompVersions = {
    'v0.2.0': {
        module: import('@rk/mantine-v0.2.0'),
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), default: 'bottom-right', customs: { isObject: true, required: 'connection' }
            }),
        ],
    }
}

//===================================================================
import imageNode from '@nodes/image'

window.Noodl.defineModule({
    reactNodes: [
        reactNode('Mantine', compVersions, { allowChildren: true }),
        imageNode
    ],
})