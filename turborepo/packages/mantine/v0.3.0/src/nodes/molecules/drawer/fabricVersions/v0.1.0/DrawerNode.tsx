import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_4_0 from './v0.4.0/Drawer'

//===================================================================

const compVersions: CompVersions = {
    'v0.4.0': {
        Comp: v0_4_0,
        inputs: getPorts('input', ['drawerPosition', 'drawerTitle', 'sizePresets', 'sizeUnits', 'drawerHeaderEnabled', 'closeActionEnabled',
            'drawerOpacity', 'drawerBlur', 'drawerTitleOrder', 'trapFocus', 'returnFocus', 'closeOnEscape', 'closeOnClickOutside']),
        outputs: getPorts('output', ['closed']),
        signals: getPorts('input', ['open', 'close'])
    }
}

//===================================================================

export default getReactNode('Drawer', compVersions, true)