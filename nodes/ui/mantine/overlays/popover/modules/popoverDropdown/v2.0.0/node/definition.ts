import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps;

import Comp from '../component/PopoverDropdown';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	beforeNode: {
		validate: async (model) => {
			const parentNodeName = model.parent?.type.split('.')[2];
			if (parentNodeName === 'Popover') return true;
			else return `Parent of "PopoverDropdown" must be "Popover", got "${parentNodeName}".`;
		},
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;
