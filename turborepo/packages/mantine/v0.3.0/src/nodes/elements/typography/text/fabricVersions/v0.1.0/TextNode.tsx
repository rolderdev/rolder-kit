import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_5_0 from './v0.5.0/Text'
import v0_6_0 from './v0.6.0/Text'

//===================================================================

const compVersions: CompVersions = {
    'v0.5.0': {
        Comp: v0_5_0,
        inputs: getPorts('input', ['fz', 'fw', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta',
            'textFormat', 'textMask', 'numberFormat', 'dateFormatAtText', 'dataSource', 'itemSource', 'sourceField', 'valueSource'])
    },
    'v0.6.0': {
        Comp: v0_6_0,
        inputs: getPorts('input', [
            'fz', 'fw', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta', 'textFormat', 'textMask', 'numberFormat',
            'dateFormatAtText', 'dataSource', 'itemSource', 'sourceField', 'valueSource', 'useScope', 'scope',
        ])
    }
}

//===================================================================

export default getReactNode('Text', compVersions, false)