import { reactNode } from '@shared/node'
import { getPorts, getPort, getCustomEnumType, getUnitType, defaultUnits, getMantinePort, inputGroups } from '@shared/port'
import { lazy } from 'react'

const variants = ['light', 'filled', 'outline', 'dot', 'gradient']

export default reactNode('Highlight', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/highlight-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/elements/typography/highlight-v1.0.0')),
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'fz', 'fw', 'color', 'w', 'h', 'opacity', 'inline',
                'fitContent', 'ta', 'textFormat', 'textMask', 'numberFormat', 'dataSource', 'itemSource', 'sourceField',
                'valueSource', 'highlight', 'highlightColor', 'highlightStyles'
            ]),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope', type: getCustomEnumType(['table']),
                default: 'table', customs: {
                    required: 'connection',
                    dependsOn(props) { return props.useScope ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'dateFormatAtText', displayName: 'Date format', group: 'Params', type: 'string',
                default: 'YYYY.MM.DD',
                customs: { required: 'both', dependsOn(props) { return props.textFormat === 'date' } }
            }),
        ]
    }
}, { moduleName: 'mantine' })