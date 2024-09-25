import type { BaseJsProps } from '@shared/node-v1.0.0';
import type { JsNodeDef } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';

import initState from '@shared/init-state-v0.1.0';

export type Props = BaseJsProps & {
	type: 'number' | 'jsDate';
	numberDate?: number;
	jsDate?: Date;
	format?: string;
};

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/formatDate') },
	inputs: [
		getPortDef({
			name: 'type',
			displayName: 'Type',
			group: 'Data',
			type: [
				{ label: 'Number', value: 'number' },
				{ label: 'JS Date', value: 'jsDate' },
			],
			default: 'number',
		}),
		getPortDef({
			name: 'numberDate',
			displayName: 'Date',
			group: 'Data',
			type: 'number',
			dependsOn: (p: Props) => p.type === 'number',
		}),
		getPortDef({
			name: 'jsDate',
			displayName: 'Date',
			group: 'Data',
			type: '*',
			dependsOn: (p: Props) => p.type === 'jsDate',
			visibleAt: 'connection',
		}),
		getPortDef({
			name: 'format',
			displayName: 'Format',
			group: 'Params',
			type: 'string',
			default: 'YYYY.MM.DD',
		}),
	],
	outputs: [getPortDef({ name: 'string', displayName: 'String', group: 'Data', type: 'string' })],
	triggerOnInputs: () => ['type', 'numberDate', 'jsDate', 'format'],
	getInspectInfo: (p: Props, outProps) => [{ type: 'text', value: outProps.string }],
	initialize: async () => {
		await initState('shared');
	},
	disableCustomProps: true,
} satisfies JsNodeDef;
