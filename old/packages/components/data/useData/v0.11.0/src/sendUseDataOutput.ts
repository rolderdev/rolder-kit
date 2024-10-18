import type { NoodlNode } from '@packages/node'

export default function (noodlNode: NoodlNode, portName: string, value: any) {
	if (noodlNode.hasOutput(portName)) {
		noodlNode.outputPropValues[portName] = value
		noodlNode.flagOutputDirty(portName)
	}
}
