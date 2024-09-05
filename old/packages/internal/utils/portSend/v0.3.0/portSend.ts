import type { NoodlNode as OldNoodlNode } from '@packages/node';
import type { NoodlNode } from '@packages/node-v1.0.0';

export function sendOutput(noodlNode: OldNoodlNode | NoodlNode, portName: string, value: any) {
	if (noodlNode?.hasOutput(portName as string)) {
		noodlNode.outputPropValues[portName] = value;
		noodlNode.flagOutputDirty(portName as string);
	}
}

export function sendOutputs(noodlNode: OldNoodlNode | NoodlNode, ports: { portName: string; value: any }[]) {
	ports.map((i) => {
		if (noodlNode?.hasOutput(i.portName as string)) noodlNode.outputPropValues[i.portName] = i.value;
	});
	noodlNode.flagAllOutputsDirty();
}

export function sendSignal(noodlNode: OldNoodlNode | NoodlNode, portName: string) {
	if (noodlNode?.hasOutput(portName as string)) setTimeout(() => noodlNode.sendSignalOnOutput(portName as string));
}
