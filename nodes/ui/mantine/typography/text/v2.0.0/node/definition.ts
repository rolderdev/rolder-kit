import { getPortDef } from '@shared/port-v1.0.0';
import {} from '@shared/node-v1.0.0';

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/text') },
	inputs: [],
	outputs: [],
	triggerOnInputs(p) {
		return [];
	},
	getInspectInfo(p) {
		if (p.fields)
			return [
				{ type: 'text', value: 'Search fields' },
				{ type: 'value', value: p.fields },
			];
		else return [];
	},
	disableCustomProps: true,
} as any;
