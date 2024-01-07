import { getPorts } from '@rk/port'
import { CompVersions, reactNode } from '@rk/node'

const notifEnum = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']

const compVersions: CompVersions = {
    'v0.3.1': {
        module: import('@rk/image-v0.4.0'),
        inputs: getPorts('input', ['src', 'radius'])
    }
}

//===================================================================
export default reactNode('Image3', compVersions, { allowChildren: true })