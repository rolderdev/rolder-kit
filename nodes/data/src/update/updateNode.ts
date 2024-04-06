import { jsNode } from '@packages/node'
import { getPort, getPorts } from '@packages/port'

export default jsNode('update', {
    'v0.3.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/update-v0.3.0')
        },
        inputs: [
            ...getPorts('input', ['update']),
            getPort({
                plug: 'input', name: 'updateScheme', displayName: 'Update scheme', group: 'Data', type: 'array',
                customs: { required: 'connection' }
            })
        ],
        outputs: [
            ...getPorts('output', ['updated', 'updating']),
            getPort({ plug: 'output', name: 'updatedData', displayName: 'Updated data', group: 'Data', type: 'object' })
        ]
    },
    'v1.0.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/update-v1.0.0')
        },
        inputs: [
            ...getPorts('input', ['update', 'scheme']),
            getPort({ plug: 'input', name: 'optimistic', displayName: 'Optimistic', group: 'Params', type: 'boolean', default: false })
        ],
        outputs: [
            ...getPorts('output', ['updated', 'updating', 'data']),
            getPort({ plug: 'output', name: 'optimisticUpdated', displayName: 'Optimistic updated', group: 'Signals', type: 'signal' })
        ]
    },
    'v1.1.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/update-v1.1.0')
        },
        inputs: [
            ...getPorts('input', ['update']),
            getPort({
                plug: 'input', name: 'scheme', displayName: 'Scheme', group: 'Params', type: 'array',
                customs: {
                    required: 'connection',
                    validate(p) {
                        if (!p.scheme) return true
                        else {
                            const sizeDbClasses: string[] = []
                            p.scheme.map((i: any) => { if (i.items?.length > 1000) sizeDbClasses.push(i.dbClass) })
                            if (sizeDbClasses.length) {
                                return `You can update 1000 or less documents per request. Mismatched DB classes: ${sizeDbClasses.join(', ')}`
                            } else return true
                        }
                    },
                }
            }),
            getPort({ plug: 'input', name: 'optimistic', displayName: 'Optimistic', group: 'Params', type: 'boolean', default: false })
        ],
        outputs: [
            ...getPorts('output', ['updated', 'updating', 'data']),
            getPort({
                plug: 'output', name: 'optimisticUpdated', displayName: 'Optimistic updated', group: 'Signals', type: 'signal',
                customs: { dependsOn(p) { return p.optimistic ? true : false } }
            })
        ]
    }
}, { docs: 'https://docs.rolder.app/docs/data/update.html' })