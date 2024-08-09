import type { NoodlNode } from '@packages/node';

export function sendOutput(noodlNode: NoodlNode, portName: string, value: any) {
	if (noodlNode?.hasOutput(portName as string)) {
		noodlNode.outputPropValues[portName] = value;
		noodlNode.flagOutputDirty(portName as string);
	}
}

export function sendOutputs(noodlNode: NoodlNode, ports: { portName: string; value: any }[]) {
	ports.map((i) => {
		if (noodlNode?.hasOutput(i.portName as string)) noodlNode.outputPropValues[i.portName] = i.value;
	});
	noodlNode.flagAllOutputsDirty();
}

export function sendSignal(noodlNode: NoodlNode, portName: string) {
	if (noodlNode?.hasOutput(portName as string)) setTimeout(() => noodlNode.sendSignalOnOutput(portName as string));
}
