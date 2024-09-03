import type { Props } from '../node/definition';

export default (p: Props) => {
	const parentNodeName = p.noodlNode.parent.model.type?.split('.');
	if (!parentNodeName.includes('Data'))
		return `Auth node error: parent node must be Data, got ${R.libs.just.last(parentNodeName)}`;
	return true;
};
