import { reactNode } from '@packages/node'
import { getPort, getPorts, getType } from '@packages/port'
import { lazy } from 'react'

export default reactNode('UseData', {
    'v0.11.0': {
        hashTag: '#deprecated',
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                "@packages/use-data-v0.11.0"))
        },
        inputs: [
            getPort({
                plug: 'input', name: 'dbClasses', displayName: 'DB classes', group: 'DB classes',
                type: 'proplist', customs: {
                    required: 'both',
                    addNodePorts(dbClasses) {
                        return dbClasses.map((i: string) =>
                            ({ plug: 'output', name: i, group: 'DB classes', type: 'array', displayName: i }))
                    }
                }
            }),
            getPort({ plug: 'input', name: 'useDataScheme', displayName: 'Scheme', group: 'Params', type: 'array' }),
            getPort({
                plug: 'input', name: 'searchString', displayName: 'Search string', group: 'Params', type: getType('string', 'connection')
            }),
            getPort({ plug: 'input', name: 'refetch', displayName: 'Refetch', group: 'Signals', type: 'signal' }),
        ],
        outputs: [
            getPort({ plug: 'output', name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'output', name: 'founded', displayName: 'Founded', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'output', name: 'fetching', displayName: 'Fetching', group: 'States', type: 'boolean', default: false }),
            getPort({ plug: 'output', name: 'pending', displayName: 'Pending', group: 'States', type: 'boolean', default: false }),
        ]
    },
    'v0.12.3': {
        hashTag: '#deprecated',
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                "@packages/use-data-v0.12.3"))
        },
        inputs: [
            ...getPorts('input', ['dbClass', 'filters', 'sorts', 'querySize', 'getUsers', 'searchFields', 'searchString', 'aggQuery']),
            getPort({
                plug: 'input', name: 'useDataContext', displayName: 'Use context', group: 'Params', type: getType('boolean', 'editor'),
                default: false
            }),
            getPort({
                plug: 'input', name: 'refs', displayName: 'References', group: 'References', type: getType('proplist', 'editor'),
                customs: {
                    dependsOn(p) { return p.useDataContext === true }
                }
            }),
            getPort({
                plug: 'input', name: 'backRefs', displayName: 'Backward references', group: 'Backward references',
                type: getType('proplist', 'editor'),
                customs: {
                    dependsOn(p) { return p.useDataContext === true }
                }
            }),
            getPort({ plug: 'input', name: 'refetch', displayName: 'Refetch', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'input', name: 'nextFetch', displayName: 'Next', group: 'Pagination', type: 'signal' }),
            getPort({ plug: 'input', name: 'previousFetch', displayName: 'Previous', group: 'Pagination', type: 'signal' }),
        ],
        outputs: [
            ...getPorts('output', ['items', 'fetching', 'fetched']),
            getPort({ plug: 'output', name: 'fetchedPage', displayName: 'Page', group: 'Pagination', type: 'number' }),
            getPort({ plug: 'output', name: 'aggregations', displayName: 'Aggregations', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'fetchedItemsCount', displayName: 'Fetched count', group: 'Data', type: 'number' }),
            getPort({ plug: 'output', name: 'totalItemsCount', displayName: 'Total count', group: 'Data', type: 'number' }),
        ]
    },
    'v0.12.4': {
        hashTag: '#deprecated',
        module: {

            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                "@packages/use-data-v0.12.4"))
        },
        inputs: [
            ...getPorts('input', ['dbClass', 'filters', 'sorts', 'querySize', 'getUsers', 'searchFields', 'searchString', 'aggQuery']),
            getPort({
                plug: 'input', name: 'useDataContext', displayName: 'Use context', group: 'Params', type: getType('boolean', 'editor'),
                default: false
            }),
            getPort({
                plug: 'input', name: 'refs', displayName: 'References', group: 'References', type: getType('proplist', 'editor'),
                customs: {
                    dependsOn(p) { return p.useDataContext === true }
                }
            }),
            getPort({
                plug: 'input', name: 'backRefs', displayName: 'Backward references', group: 'Backward references',
                type: getType('proplist', 'editor'),
                customs: {
                    dependsOn(p) { return p.useDataContext === true }
                }
            }),
            getPort({ plug: 'input', name: 'refetch', displayName: 'Refetch', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'input', name: 'nextFetch', displayName: 'Next', group: 'Pagination', type: 'signal' }),
            getPort({ plug: 'input', name: 'previousFetch', displayName: 'Previous', group: 'Pagination', type: 'signal' }),
        ],
        outputs: [
            ...getPorts('output', ['items', 'fetching', 'fetched']),
            getPort({ plug: 'output', name: 'fetchedPage', displayName: 'Page', group: 'Pagination', type: 'number' }),
            getPort({ plug: 'output', name: 'aggregations', displayName: 'Aggregations', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'fetchedItemsCount', displayName: 'Fetched count', group: 'Data', type: 'number' }),
            getPort({ plug: 'output', name: 'totalItemsCount', displayName: 'Total count', group: 'Data', type: 'number' }),
        ]
    },
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                "@packages/use-data-v1.0.0"))
        },
        inputs: [
            getPort({
                plug: 'input', name: 'outputDbClasses', displayName: 'Output DB classes', group: 'Output DB classes',
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
                plug: 'input', name: 'fetchScheme', displayName: 'Scheme', group: 'Scheme', type: 'array',
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'searchEnabled', displayName: 'Enabled', group: 'Search', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'searchString', displayName: 'Search string', group: 'Search',
                type: getType('string', 'connection'), customs: { dependsOn(p) { return p.searchEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'paginationEnabled', displayName: 'Enabled', group: 'Pagination', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'paginationDbClass', displayName: 'Pagination DB class', group: 'Pagination', type: 'string',
                customs: {
                    required: 'connection',
                    dependsOn(p) { return p.paginationEnabled ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'nextFetch', displayName: 'Next', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'previousFetch', displayName: 'Previous', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
        ],
        outputs: [
            ...getPorts('output', ['fetching', 'fetched']),
            getPort({ plug: 'output', name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'fetchedPage', displayName: 'Page', group: 'Pagination', type: 'number' }),
        ]
    },
    'v1.1.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                "@packages/use-data-v1.1.0"))
        },
        inputs: [
            getPort({
                plug: 'input', name: 'outputDbClasses', displayName: 'Output DB classes', group: 'Output DB classes',
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
                plug: 'input', name: 'fetchScheme', displayName: 'Scheme', group: 'Scheme', type: 'array',
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'searchEnabled', displayName: 'Enabled', group: 'Search', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'searchString', displayName: 'Search string', group: 'Search',
                type: getType('string', 'connection'), customs: { dependsOn(p) { return p.searchEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'paginationEnabled', displayName: 'Enabled', group: 'Pagination', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'paginationDbClass', displayName: 'Pagination DB class', group: 'Pagination', type: 'string',
                customs: {
                    required: 'connection',
                    dependsOn(p) { return p.paginationEnabled ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'nextFetch', displayName: 'Next', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'previousFetch', displayName: 'Previous', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
            getPort({ plug: 'input', name: 'refetch', displayName: 'Refetch', group: 'Signals', type: 'signal' }),
        ],
        outputs: [
            ...getPorts('output', ['fetching', 'fetched']),
            getPort({ plug: 'output', name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'fetchedPage', displayName: 'Page', group: 'Pagination', type: 'number' }),
        ]
    },
    'v1.2.0': {
        hashTag: '#pre-release',
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                "@packages/use-data-v1.2.0"))
        },
        inputs: [
            getPort({
                plug: 'input', name: 'outputDbClasses', displayName: 'Output DB classes', group: 'Output DB classes',
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
                plug: 'input', name: 'fetchScheme', displayName: 'Scheme', group: 'Scheme', type: 'array',
                customs: {
                    required: 'connection',
                    validate(p) {
                        if (!p.fetchScheme) return true
                        else {
                            const sizeDbClasses: string[] = []
                            p.fetchScheme.map((i: any) => { if (i.size > 1000) sizeDbClasses.push(i.dbClass) })
                            const historyDbClasses: string[] = []
                            p.fetchScheme.map((i: any) => { if (i.history > 1000) historyDbClasses.push(i.dbClass) })
                            if (sizeDbClasses.length) {
                                return `Size should be less or equal 1000. Mismatched DB classes: ${sizeDbClasses.join(', ')}`
                            } else if (historyDbClasses.length) {
                                return `History should be less or equal 1000. Mismatched DB classes: ${historyDbClasses.join(', ')}`
                            } else return true
                        }
                    },
                }
            }),
            getPort({
                plug: 'input', name: 'searchEnabled', displayName: 'Enabled', group: 'Search', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'searchString', displayName: 'Search string', group: 'Search',
                type: getType('string', 'connection'), customs: { dependsOn(p) { return p.searchEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'paginationEnabled', displayName: 'Enabled', group: 'Pagination', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'paginationDbClass', displayName: 'Pagination DB class', group: 'Pagination', type: 'string',
                customs: {
                    required: 'connection',
                    dependsOn(p) { return p.paginationEnabled ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'nextFetch', displayName: 'Next', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'previousFetch', displayName: 'Previous', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
            getPort({ plug: 'input', name: 'refetch', displayName: 'Refetch', group: 'Signals', type: 'signal' }),
        ],
        outputs: [
            ...getPorts('output', ['fetching', 'fetched']),
            getPort({ plug: 'output', name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'fetchedPage', displayName: 'Page', group: 'Pagination', type: 'number' }),
        ]
    },
    'v1.3.0': {
        hashTag: '#expreimental',
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                "@packages/use-data-v1.3.0"))
        },
        inputs: [
            getPort({
                plug: 'input', name: 'outputDbClasses', displayName: 'Output DB classes', group: 'Output DB classes',
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
                plug: 'input', name: 'fetchScheme', displayName: 'Scheme', group: 'Scheme', type: 'array',
                customs: {
                    required: 'connection',
                    validate(p) {
                        if (!p.fetchScheme) return true
                        else {
                            const sizeDbClasses: string[] = []
                            p.fetchScheme.map((i: any) => { if (i.size > 1000) sizeDbClasses.push(i.dbClass) })
                            const historyDbClasses: string[] = []
                            p.fetchScheme.map((i: any) => { if (i.history > 1000) historyDbClasses.push(i.dbClass) })
                            if (sizeDbClasses.length) {
                                return `Size should be less or equal 1000. Mismatched DB classes: ${sizeDbClasses.join(', ')}`
                            } else if (historyDbClasses.length) {
                                return `History should be less or equal 1000. Mismatched DB classes: ${historyDbClasses.join(', ')}`
                            } else return true
                        }
                    },
                }
            }),
            getPort({
                plug: 'input', name: 'searchEnabled', displayName: 'Enabled', group: 'Search', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'searchString', displayName: 'Search string', group: 'Search',
                type: getType('string', 'connection'), customs: { dependsOn(p) { return p.searchEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'paginationEnabled', displayName: 'Enabled', group: 'Pagination', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'paginationDbClass', displayName: 'Pagination DB class', group: 'Pagination', type: 'string',
                customs: {
                    required: 'connection',
                    dependsOn(p) { return p.paginationEnabled ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'nextFetch', displayName: 'Next', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'previousFetch', displayName: 'Previous', group: 'Pagination', type: 'signal',
                customs: { dependsOn(p) { return p.paginationEnabled ? true : false } }
            }),
            getPort({ plug: 'input', name: 'refetch', displayName: 'Refetch', group: 'Signals', type: 'signal' }),
        ],
        outputs: [
            ...getPorts('output', ['fetching', 'fetched']),
            getPort({ plug: 'output', name: 'data', displayName: 'Data', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'fetchedPage', displayName: 'Page', group: 'Pagination', type: 'number' }),
            getPort({ plug: 'output', name: 'error', displayName: 'Error', group: 'State', type: 'boolean' }),
        ]
    }
}, { docs: 'https://docs.rolder.app/docs/data/useData.html' })