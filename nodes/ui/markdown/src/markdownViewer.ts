import { getPort, getPorts } from '@packages/port';
import { reactNode } from '@packages/node';
import { lazy } from 'react';

export default reactNode('MarkdownViewer', {
	'v0.1.0': {
		module: { dynamic: lazy(() => import('@packages/markdown-viewer-v0.1.0')) },
		inputs: [
			...getPorts('input', ['customProps']),
			getPort({
				plug: 'input',
				name: 'markdown',
				displayName: 'Markdown',
				group: 'Data',
				type: { name: 'string', codeeditor: 'plaintext' }
			})
		]
	}
});
