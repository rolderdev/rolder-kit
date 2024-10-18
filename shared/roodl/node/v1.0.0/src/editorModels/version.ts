/* Модель порта "Version" */

import { getNodePort, getPortDef } from '@shared/port-v1.0.0'
import type { GraphModelNode, JsNodeVersions, NodeContext, ReactNodeVersions } from '../../main'
import { clearWarning, sendWarning } from './warning'

export const getVersionPortDef = (versions: JsNodeVersions | ReactNodeVersions) => {
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
	}
}

export const getVersionPort = (versions: JsNodeVersions | ReactNodeVersions) => {
	return getNodePort('input', getVersionPortDef(versions))
}

export const validateVersion = (model: GraphModelNode, context: NodeContext) => {
	if (!model.parameters.version) sendWarning(model, context, 'value', 'Version', 'Choose version')
	else clearWarning(model, context, 'value', 'Version')
}
