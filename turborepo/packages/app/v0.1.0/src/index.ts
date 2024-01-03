// @ts-ignore
import { defineModule } from '@noodl/noodl-sdk'
import nodesStore from './nodes/nodesStore'

defineModule({
    reactNodes: nodesStore,
    settings: [
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Project', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'Project' }
    ]
})