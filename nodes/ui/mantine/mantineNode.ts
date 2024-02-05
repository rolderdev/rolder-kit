import { getCustomEnumType, getPort } from '@shared/port'
import { reactNode } from '@shared/node'
import { lazy } from 'react'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const mantineNode = reactNode('Mantine', {
    'v0.3.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/mantine-v0.3.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/mantine-v0.3.0')),
        },
        inputs: [
            getPort({
                plug: 'input', name: 'notificationsPosition', displayName: 'Notifications position', group: 'Layout',
                type: getCustomEnumType(notifEnum), default: 'bottom-right', customs: { isObject: true, required: 'connection' }
            }),
        ],
    }
}, { allowChildren: true, moduleName: 'mantine' })

//===================================================================
import imageNode from '@nodes/image'
import passwordInputNode from '@nodes/password-input'
//import formNode from '@nodes/form'

Noodl.defineModule({ reactNodes: [mantineNode, imageNode, passwordInputNode] })