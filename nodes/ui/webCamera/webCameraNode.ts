import { getCustomEnumType, getPort } from '@shared/port'
import { reactNode } from '@shared/node'
import { lazy } from 'react'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const webCameraNode = reactNode('WebCamera', {
    'v0.3.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/web-camera-v0.3.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/web-camera-v0.3.0')),
        },
        inputs: [
            getPort({ plug: 'input', name: 'takeScreenshot', displayName: 'Take screenshot', group: 'Signals', type: 'signal' }),
        ],
        outputs: [
            getPort({ plug: 'output', name: 'screenshoted', displayName: 'Screenshoted', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'output', name: 'screenshot', displayName: 'Screenshoted', group: 'Data', type: '*' }),
        ]
    }
}, { moduleName: 'mantine' })

//===================================================================

//Noodl.defineModule({ reactNodes: [webCameraNode] })