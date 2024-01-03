import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/Title'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['titleOrder', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta',
            'textFormat', 'textMask', 'numberFormat', 'dateFormatAtText', 'dataSource', 'itemSource', 'sourceField', 'valueSource'])
    }
}

//===================================================================

export default getReactNode('Title', compVersions)