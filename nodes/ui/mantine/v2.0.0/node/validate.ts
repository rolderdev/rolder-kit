import type { GraphModelNode } from '@shared/node-v1.0.0'

export default (model: GraphModelNode) => {
	const parentNodeName = model.parent.type?.split('.')
	if (!parentNodeName.includes('App')) return `Parent node must be "App", got "${R.libs.just.last(parentNodeName)}"`
	return true
}
