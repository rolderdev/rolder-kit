import { jsNode } from '@shared/node'
import { getPorts } from '@shared/port'

export default jsNode('fetch', 'data', {
    'v0.1.0': {
        //@ts-ignore
        module: import('remote/data/fetch-v0.1.0'),
        inputs: getPorts('input', ['fetch', 'dbClass', 'filters', 'sorts', 'querySize']),
        outputs: getPorts('output', ['items', 'fetching', 'fetched'])
    }
})