import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'
import { lazy } from 'react'

const dataNode = reactNode('Data', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/data-v1.0.0')),
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                `remote/data/data-v1.0.0`)),
        },
        inputs: [
            getPort({
                plug: 'input', name: 'backendVersion', displayName: 'Backend version', group: 'Params', type: 'string',
                customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'dbName', displayName: 'DB name', group: 'Params', type: 'string',
                customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'backendDevMode', displayName: 'Backend dev mode', group: 'Params', type: 'boolean',
                default: false
            }),
            getPort({
                plug: 'input', name: 'backendUrl', displayName: 'Backend url', group: 'Params', type: 'string',
                customs: {
                    required: 'both',
                    dependsOn(p) { return p.backendDevMode },
                }
            }),
            getPort({
                plug: 'input', name: 'backendPort', displayName: 'Backend port', group: 'Params', type: 'number', default: 7512,
                customs: {
                    required: 'both',
                    dependsOn(p) { return p.backendDevMode },
                }
            }),
        ],
        outputs: [getPort({ plug: 'output', name: 'isOnline', displayName: 'Online', group: 'States', type: 'boolean' })]
    },
}, { allowChildren: true, moduleName: 'data' })

//===================================================================
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk'

import authNode from '@nodes/auth'
import dataContext from '@nodes/data-context'
import useDataNode from '@nodes/use-data'

const reactNodes = [authNode, dataNode, dataContext, useDataNode]

import getDataNode from '@nodes/get-data'
import logoutNode from '@nodes/logout'
import noderedNode from '@nodes/nodered'
import saveAsNode from '@nodes/save-as'

const nodes = [getDataNode, logoutNode, noderedNode, saveAsNode]

Noodl.defineModule({ reactNodes, nodes: nodes.map(i => defineNode(i)) })