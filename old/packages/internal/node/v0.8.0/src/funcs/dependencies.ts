import type { NodePort } from '@packages/port'
import type { Props } from '../../types'

export function filterPortsByDependencies(allNodePorts: NodePort[], nodeProps: Props) {
	const resultNodePorts: NodePort[] = []

	allNodePorts.forEach((nodePort) => {
		if (nodePort.customs?.dependsOn) {
			if (nodePort.customs.dependsOn(nodeProps, nodePort)) resultNodePorts.push(nodePort)
		} else resultNodePorts.push(nodePort)
	})

	return resultNodePorts
}
