import { NoodlNode } from '@shared/node-v1.0.0';

export function sendOutput(noodlNode: NoodlNode, portName: string, value: any) {
	if (noodlNode?.hasOutput(portName as string)) {
		noodlNode.outputPropValues[portName] = value;
		noodlNode.flagOutputDirty(portName as string);
	}
}

export function sendSignal(noodlNode: NoodlNode, portName: string) {
	if (noodlNode?.hasOutput(portName as string)) setTimeout(() => noodlNode.sendSignalOnOutput(portName as string));
}
