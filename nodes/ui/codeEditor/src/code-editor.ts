import { getPort, getPorts, getType } from '@packages/port';
import { reactNode } from '@packages/node';
import { lazy } from 'react';

const CodeEditorNode = reactNode('CodeEditor', {
	'v0.1.0': {
		module: {
			dynamic: lazy(() => import('@packages/code-editor-v0.1.0')),
		},
		inputs: [
			...getPorts('input', ['customProps']),
			getPort({ plug: 'input', name: 'ganttTasks', displayName: 'Tasks', group: 'Data', type: getType('array', 'connection') }),
			getPort({
				plug: 'input',
				name: 'showTaskList',
				displayName: 'Show task list',
				group: 'Params',
				type: 'boolean',
				default: false,
			}),
			getPort({
				plug: 'input',
				name: 'ganttHeight',
				displayName: 'Height',
				group: 'Dimensions',
				type: 'boolean',
				default: false,
			}),
		],
		outputs: [
			getPort({
				plug: 'output',
				name: 'codeText',
				displayName: 'Task progress changed',
				group: 'Signals',
				type: 'signal',
			}),
			...getPorts('input', ['doubleClicked']),
		],
	},
});

//===================================================================

Noodl.defineModule({ reactNodes: [CodeEditorNode] });
