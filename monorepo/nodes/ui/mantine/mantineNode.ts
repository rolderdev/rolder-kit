import { getCustomEnumType, getPort } from '@rk/port'
import { CompVersions, reactNode } from '@rk/node'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const compVersions: CompVersions = {
    /* 'v0.1.0': {
        hashTag: 'deprecated',
        module: import('../../../monorepo_old/packages/mantine/nodes/mantine/fabricVersions/v0.1.0/v0.1.0/Mantine'),
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), customs: { isObject: true, required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'detectColorScheme', displayName: 'Autodetect color scheme', group: 'Style',
                type: 'boolean', default: false, customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'colorScheme', displayName: 'Color scheme', group: 'Style',
                type: getCustomEnumType(['light', 'dark', 'auto']), default: 'light', customs: { required: 'connection' }
            }),
        ]
    }, */
    'v0.2.0': {
        module: import('@rk/mantine-v0.2.0'),
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), customs: { isObject: true }
            }),            
        ],
    }
}

//===================================================================
//import {jsNodeStore, rNodesStore} from '@rk/mantine-old'
import imageNode from '@nodes/image'

window.Noodl.defineModule({
    reactNodes: [reactNode('Mantine', compVersions, { allowChildren: true }), imageNode],
  //  nodes: jsNodeStore.map(i => window.Noodl.defineNode(i)),
})