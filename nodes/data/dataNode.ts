import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'

const dataNode = reactNode('Data', {
    'v0.2.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/data-v0.2.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/data/data-v0.2.0')),
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
import { lazy } from 'react'

const nodes = [getDataNode]

Noodl.defineModule({ reactNodes, nodes: nodes.map(i => defineNode(i)) })