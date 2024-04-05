import { reactNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('TableSelectionScope', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/table-selection-scope-v1.0.0'))
        },
        inputs: [
            ...getPorts('input',['reset']),
            // getPort({
            //     plug: 'input', name: 'formScheme', displayName: 'Scheme', group: 'Params', type: 'array',
            //     customs: { isObject: true, required: 'connection' }
            // }),
            getPort({ plug: 'input', name: 'newSelectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' }),
        ],
        outputs: [
            getPort({ plug: 'output', name: 'selectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'selectionByTableId', displayName: 'selectionByTableId', group: 'Data', type: 'object' }),
            getPort({ plug: 'output', name: 'changed', displayName: 'changed', group: 'Signals', type: 'signal' }),
        ]
    }
}, {  allowChildren: true })


// export type TypeName = '*' | 'string' | 'number' | 'boolean' | 'array' | 'signal' | 'proplist' | 'color' | 'object'
// export type GroupName = 'Project' | 'Version' | 'Scope' | 'Data' | 'Signals' | 'Params' | 'Style' | 'Loader' | 'Layout' |
//   'Dimensions' | 'Placeholder' | 'Advanced' | 'States' | 'Icon' | 'DB classes' | 'Query params' | 'References' |
//   'Backward references' | 'Search' | 'Search fields' | 'Pagination' | 'Form' | 'Output DB classes*' | 'Fetch' | 'Mask params' |
//   'Checkbox' | 'Margins' | 'Paddings' | 'Enablers' | 'Single selection' | 'Multi selection' | 'Sort' | 'Filter' | 'Expansion' |
//   'Table styles' | 'Row styles' | 'Font' | 'Highlight' | 'Theme icon' | 'Scheme' | 'Network' | 'Columns' | 'Table style' |
//   'Header style' | 'Row style' | 'Icons'
// export type OutputName = 'colorScheme' | 'colorSchemeChanged' | 'items' | 'fetching' | 'fetched' | 'userRole' | 'signedIn' |
//   'signedOut' | 'reseted' | 'typedValue' | 'aggregations' | 'fetchedPage' | 'fetchedItemsCount' | 'totalItemsCount' | 'width' |
//   'height' | 'formHook' | 'submited' | 'screenshot' | 'screenshoted' | 'totalPages' | 'currentPage'