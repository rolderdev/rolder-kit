/* Модель порта "Version" */

import { getPortDef, type PortDef } from '@packages/port';
import type { GraphModelNode, JsVersions, NodeContext } from '../../types';

export const getVersionPortDef = (versions: JsVersions) => {
	return {
		...getPortDef({
			name: 'version',
			displayName: 'Version',
			group: 'Version',
			type: Object.keys(versions).map((i) => ({
				value: i,
				label: i + (versions[i]?.hashTag ? ' ' + versions[i]?.hashTag : ''),
			})),
			visibleAt: 'editor',
		}),
		index: 0,
	} as PortDef;
};

export const validateVersion = (node: GraphModelNode, context: NodeContext) => {
	/* if (!node.parameters.version) {
		context.editorConnection.sendWarning(node.component.name, node.id, undefined, {
			message: 'Choose version',
			showGlobally: true,
		});
	} else context.editorConnection.clearWarning(node.component.name, node.id); */
};
