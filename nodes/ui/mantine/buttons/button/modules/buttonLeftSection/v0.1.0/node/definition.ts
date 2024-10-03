import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {};

import Comp from '../component/ButtonLeftSection';

export default {
	hashTag: '#expreimental',
	module: { static: Comp },
	beforeNode: {
		validate: async (model) => {
			const parentNodeName = model.parent?.type.split('.')[2];
			if (parentNodeName === 'Button') return true;
			else return `Parent of "ButtonLeftSection" must be "Button", got "${parentNodeName}".`;
		},
	},
} satisfies ReactNodeDef;
