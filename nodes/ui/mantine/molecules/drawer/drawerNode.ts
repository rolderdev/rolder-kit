import { reactNode } from '@shared/node'
import { defaultUnits, enums, getCustomEnumType, getEnumType, getPort, getPorts, getUnitType } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Drawer', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/drawer-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps', 'open', 'close']),
            getPort({
                plug: 'input', name: 'drawerPosition', displayName: 'Position', group: 'Layout', default: 'right',
                type: getCustomEnumType(['right', 'top', 'bottom', 'left']), customs: { required: 'both' }
            }),
            getPort({
                plug: 'input', name: 'sizePresets', displayName: 'Size', group: 'Dimensions', default: 'sm',
                type: getEnumType(enums.sizes)
            }),
            getPort({
                plug: 'input', name: 'sizeUnits', displayName: 'Size (units)', group: 'Dimensions',
                type: getUnitType(defaultUnits, 'rem')
            }),
            getPort({
                plug: 'input', name: 'drawerHeaderEnabled', displayName: 'Header', group: 'Params', default: false, type: 'boolean'
            }),
            getPort({
                plug: 'input', name: 'drawerTitle', displayName: 'drawer title', group: 'Params', type: 'string',
                customs: { dependsOn(p) { return p.drawerHeaderEnabled ? true : false } }
            }),
            getPort({
                plug: 'input', name: 'closeActionEnabled', displayName: 'Enable close action', group: 'Params', default: false,
                type: 'boolean', customs: { dependsOn(p) { return p.drawerHeaderEnabled ? true : false } }
            }),
            getPort({ plug: 'input', name: 'drawerOpacity', displayName: 'Opacity', group: 'Style', default: 0.6, type: 'number' }),
            getPort({ plug: 'input', name: 'drawerBlur', displayName: 'Blur', group: 'Style', default: 2, type: 'number' }),
            getPort({
                plug: 'input', name: 'drawerTitleOrder', displayName: 'Order', group: 'Font', default: 4, type: 'number',
                customs: { dependsOn(p) { return p.drawerHeaderEnabled ? true : false } }
            }),
            getPort({ plug: 'input', name: 'trapFocus', displayName: 'Trap focus', group: 'Params', default: true, type: 'boolean' }),
            getPort({ plug: 'input', name: 'returnFocus', displayName: 'Return focus', group: 'Params', default: true, type: 'boolean' }),
            getPort({
                plug: 'input', name: 'closeOnEscape', displayName: 'Close on escape', group: 'Params', default: false, type: 'boolean'
            }),
            getPort({
                plug: 'input', name: 'closeOnClickOutside', displayName: 'Close on click outside', group: 'Params', default: false,
                type: 'boolean'
            }),
        ],
        outputs: getPorts('output', ['closed']),
    }
}, { allowChildren: true })