import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import { clearWarning, sendWarning } from '@shared/node-v1.0.0/src/editorModels/warning';

export type Props = BaseReactProps;

import Comp from '../component/PopoverTarget';

export default {
	hashTag: '#pre-release',
	module: { static: Comp },
	initialize: async (p: Props, noodlNode) => {
		if (!Noodl.deployed) {
			const parentNodeName = noodlNode.parent?.model?.type.split('.')[2];

			if (parentNodeName !== 'Popover')
				sendWarning(
					noodlNode.model,
					noodlNode.context,
					'global',
					'global',
					`Parent of "PopoverTarget" must be "Popover", got "${parentNodeName}".`
				);
			else clearWarning(noodlNode.model, noodlNode.context, 'global', 'global');
		}
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;
