import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps;

import Comp from '../component/PopoverTarget';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	afterNode: {
		validate: async (p, model) => {
			const parentNodeName = model.parent?.type.split('.')[2];
			if (parentNodeName === 'Popover') return true;
			else return `Parent of "PopoverTarget" must be "Popover", got "${parentNodeName}".`;
		},
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;