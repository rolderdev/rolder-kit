import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_1_0 from './v0.1.0/Highlight'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: getPorts('input', [
            'fz', 'fw', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta', 'textFormat', 'textMask', 'numberFormat',
            'dateFormatAtText', 'dataSource', 'itemSource', 'sourceField', 'valueSource', 'useScope', 'scope',
            'highlight', 'highlightColor', 'highlightStyles'
        ])
    }
}

//===================================================================

export default getReactNode('Highlight', compVersions, false)