import { reactNode } from '@packages/node'
import { getPorts } from '@packages/port'
import { lazy } from 'react'

export default reactNode('ColumnFilter', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/column-filter-v1.0.0')),
        },
        inputs: getPorts('input', [
            'table2ColumnIndex', 'table2FilterValue', 'table2SetFilterValue', 'table2Filter', 'close', 'reset'
        ]),
        outputs: getPorts('output', ['table2FilterValue'])
    }
}, {  allowChildren: true })