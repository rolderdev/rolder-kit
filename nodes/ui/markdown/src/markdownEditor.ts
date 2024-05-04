import { defaultUnits, getCustomEnumType, getPort, getPorts, getUnitType } from '@packages/port';
import { reactNode } from '@packages/node';
import { lazy } from 'react';

export default reactNode('MarkdownEditor', {
	'v0.1.0': {
		module: { dynamic: lazy(() => import('@packages/markdown-editor-v0.1.0')) },
		inputs: [
			...getPorts('input', ['customProps']),
			getPort({
				plug: 'input',
				name: 'markdown',
				displayName: 'Markdown',
				group: 'Data',
				type: { name: 'string', codeeditor: 'plaintext' }
			}),
			getPort({
				plug: 'input',
				name: 'initialEditType',
				displayName: 'Edit type',
				group: 'Params',
				type: getCustomEnumType(['markdown', 'wysiwyg']),
				default: 'markdown'
			}),
			getPort({
				plug: 'input',
				name: 'previewStyle',
				displayName: 'Preview style',
				group: 'Params',
				type: getCustomEnumType(['tab', 'vertical']),
				default: 'tab'
			}),
			getPort({
				plug: 'input',
				name: 'height',
				displayName: 'Height',
				group: 'Dimensions',
				type: getUnitType(defaultUnits, 'px'),
				default: 600
			})
		],
		outputs: [
			getPort({
				plug: 'output',
				name: 'markdown',
				displayName: 'Markdown',
				group: 'Data',
				type: 'string'
			})
		]
	}
});
