import clone from 'just-clone'
import type { NodePort } from '../../types'
import advanced from '../ports/advanced'
import data from '../ports/data'
import dimensions from '../ports/dimensions'
import font from '../ports/font'
import icon from '../ports/icon'
import layout from '../ports/layout'
import params from '../ports/params'
import scope from '../ports/scope'
import signals from '../ports/signals'
import states from '../ports/states'
import style from '../ports/style'
import table from '../ports/table'

export const ports = [
	...advanced,
	...data,
	...style,
	...dimensions,
	...params,
	...states,
	...signals,
	...scope,
	...layout,
	...table,
	...font,
	...icon,
]
export type PortName = (typeof ports)[number]['name']

export function getPort(nodePort: NodePort): NodePort {
	const p = clone({
		...nodePort,
		tooltip: nodePort.name,
		displayName: nodePort.customs?.required ? nodePort.displayName + '*' : nodePort.displayName,
	})
	return p
}

export function getMantinePort(portName: PortName, mantineDefault: { comp: string; prop: string }): NodePort {
	let p = ports.find((i) => i.name === portName) as NodePort
	if (p) {
		p = clone(p)
		if (p.customs) p.customs.mantineDefault = mantineDefault
		else p.customs = { mantineDefault }
	}
	return {
		...p,
		plug: 'input',
		tooltip: p.name,
		displayName: p.customs?.required ? p.displayName + '*`' : p.displayName + '`',
	}
}

export function getPorts(plug: 'input' | 'output', portNames: PortName[]) {
	const resultPorts: NodePort[] = []
	portNames.forEach((portName) => {
		const p = ports.find((i) => i.name === portName) as NodePort
		if (p)
			resultPorts.push(
				clone({
					...p,
					plug,
					tooltip: p.name,
					displayName: p.customs?.required ? p.displayName + '*' : p.displayName,
				})
			)
	})
	return resultPorts
}

export function getGroupedPorts(plug: 'input' | 'output', portNames: PortName[], groupName: string) {
	const resultPorts: NodePort[] = []
	portNames.forEach((portName) => {
		const p = ports.find((i) => i.name === portName) as NodePort
		if (p)
			resultPorts.push(
				clone({
					...p,
					plug,
					group: groupName,
					tooltip: p.name,
					displayName: p.customs?.required ? p.displayName + '*' : p.displayName,
				})
			)
	})
	return resultPorts
}
