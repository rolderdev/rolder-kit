import type { NodePort } from '@packages/port';
import type { GraphModelNode, NodeContext, NoodlNode } from '../../types';
import { clearWarning, sendWarning } from './warnings';
import isEmpty from '@packages/is-empty';

export function editorRequired(node: GraphModelNode, context: NodeContext, nodeInputs: NodePort[]) {
	for (const nodeInput of nodeInputs) {
		const dn = nodeInput.displayName;
		const p = node.nodeProps[nodeInput.name];

		let hasReqiuredWarnings = true;
		if (nodeInput.customs?.required && ['editor', 'both'].includes(nodeInput.customs?.required)) {
			if (isEmpty(p) && isEmpty(nodeInput.default)) sendWarning(node, context, dn, `Specify required input: "${dn}"`);
			else if (Array.isArray(p) && !p.length) sendWarning(node, context, dn, `Array is empty at input "${dn}"`);
			else {
				clearWarning(node, context, dn);
				hasReqiuredWarnings = false;
			}
		} else hasReqiuredWarnings = false;

		if (!hasReqiuredWarnings && nodeInput.customs?.validate) {
			const validation = nodeInput.customs?.validate(node.nodeProps);
			if (typeof validation === 'string') sendWarning(node, context, dn, validation);
			else clearWarning(node, context, dn);
		}
	}
}

export function connectionRequired(noodlNode: NoodlNode, nodeInputs: NodePort[], props: any) {
	let filteredInputs: NodePort[] = [];
	for (const nodeInput of nodeInputs) {
		if (nodeInput.customs?.dependsOn) {
			if (nodeInput.customs.dependsOn(props)) filteredInputs.push(nodeInput);
		} else filteredInputs.push(nodeInput);
	}

	for (const nodeInput of filteredInputs) {
		const dn = nodeInput.displayName;

		let hasReqiuredWarnings = true;
		if (nodeInput.customs?.required && ['connection', 'both'].includes(nodeInput.customs?.required)) {
			if (isEmpty(props[nodeInput.name]))
				sendWarning(noodlNode.model, noodlNode.context, dn, `Empty input from connection: "${dn}"`);
			else {
				clearWarning(noodlNode.model, noodlNode.context, dn);
				hasReqiuredWarnings = false;
			}
		}

		if (nodeInput.customs?.validate) {
			const validation = nodeInput.customs?.validate(props);
			if (typeof validation === 'string') sendWarning(noodlNode.model, noodlNode.context, dn, validation);
			else clearWarning(noodlNode.model, noodlNode.context, dn);
		}
	}
}
