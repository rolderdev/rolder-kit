import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('getData', {
    'v1.0.0': {
        module: {            
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/get-data-v1.0.0')
        },
        inputs: [
            getPort({
                plug: 'input', name: 'outputDbClasses', displayName: 'Output DB classes', group: 'Output DB classes*',
                type: 'proplist', customs: {
                    addNodePorts(dbClasses) {
                        if (dbClasses) {
                            const itemsOutputs = dbClasses.map((i: any) => ({
                                plug: 'output', name: `${i}Items`, group: 'Data', type: 'array', displayName: `${i}Items`
                            }))
                            const fetchedOutputs = dbClasses.map((i: any) => ({
                                plug: 'output', name: `${i}Fetched`, group: 'Data', type: 'number', displayName: `${i}Fetched`
                            }))
                            const totalOutputs = dbClasses.map((i: any) => ({
                                plug: 'output', name: `${i}Total`, group: 'Data', type: 'number', displayName: `${i}Total`
                            }))
                            const aggsOutputs = dbClasses.map((i: any) => ({
                                plug: 'output', name: `${i}Aggregations`, group: 'Data', type: 'object', displayName: `${i}Aggregations`
                            }))
                            return [...itemsOutputs, ...fetchedOutputs, ...totalOutputs, ...aggsOutputs]
                        } else return []
                    }
                }
            }),
            getPort({
                plug: 'input', name: 'fetchScheme', displayName: 'Scheme', group: 'Params', type: 'array',
                customs: { required: 'connection' }
            }),
            getPort({ plug: 'input', name: 'getData', displayName: 'Get data', group: 'Signals', type: 'signal' }),
        ],
        outputs: [
            ...getPorts('output', ['fetching', 'fetched']),
            getPort({ plug: 'output', name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
        ]
    }
})