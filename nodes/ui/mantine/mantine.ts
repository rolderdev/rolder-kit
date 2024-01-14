import { getCustomEnumType, getPort } from '@shared/port'
import { reactNode } from '@shared/node'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const mantineNode = reactNode('Mantine', {
    'v0.2.0': {
        //@ts-ignore
        module: import('remote/mantine/mantine-v0.2.0'),
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), default: 'bottom-right', customs: { isObject: true, required: 'connection' }
            }),
        ],
    },
    'v0.3.0': {
        //@ts-ignore
        module: import('remote/mantine/mantine-v0.3.0'),
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), default: 'bottom-right', customs: { isObject: true, required: 'connection' }
            }),
        ],
    }
}, { allowChildren: true })

//===================================================================
import imageNode from '@nodes/image'

window.Noodl.defineModule({ reactNodes: [mantineNode, imageNode] })