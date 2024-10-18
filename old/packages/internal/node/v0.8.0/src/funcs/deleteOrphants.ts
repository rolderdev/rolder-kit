import isEmpty from '@packages/is-empty'
import type { NodePort } from '@packages/port'
import type { Props } from '../../types'

export function deleteOrphantNodeProps(nodeInputs: NodePort[], props: Props): Props {
	const resultProps: Props = props

	Object.keys(props).forEach((propName) => {
		if (!nodeInputs.map((i) => i.name).includes(propName)) delete resultProps[propName]
		if (isEmpty(resultProps[propName])) delete resultProps[propName]
	})

	return resultProps
}

const baseProps = [
	'version',
	'noodlNode',
	'style',
	'styles',
	'className',
	'children',
	'customProps',
	'propFunction',
	'innerProps',
]

export function deleteOrphantProps(allNodePorts: NodePort[], props: Props): Props {
	const resultProps: Props = props

	const filteredPorts: NodePort[] = []
	allNodePorts.forEach((nodePort) => {
		if (nodePort.customs?.dependsOn) {
			if (nodePort.customs.dependsOn(props)) filteredPorts.push(nodePort)
		} else filteredPorts.push(nodePort)
	})

	Object.keys(props).forEach((propName) => {
		if (!baseProps.includes(propName) && !filteredPorts.map((i) => i.name).includes(propName)) delete resultProps[propName]
		if (isEmpty(resultProps[propName])) delete resultProps[propName]
	})

	return resultProps
}
