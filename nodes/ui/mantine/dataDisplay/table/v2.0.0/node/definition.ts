import type { ReactNodeDef } from '@shared/node-v1.0.0';
import { lazy } from 'react';
import inputs from './inputs';
import outputs from './outputs';
import getStore from './store';
import type { Props } from '../types';

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/TableProvider')) },
	inputs,
	outputs,
	getInspectInfo(p: Props) {
		return [
			{ type: 'text', value: `=== Columns ===` },
			{ type: 'value', value: p.columnsDefinition },
		];
	},
	async initialize(p: Props) {
		p.store = getStore(p);
		return p;
	},
} satisfies ReactNodeDef;
