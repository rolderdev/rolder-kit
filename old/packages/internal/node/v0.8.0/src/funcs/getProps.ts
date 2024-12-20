import type { CompVersions, Props } from '../../types'
import { convertAndCheckProp } from './convertAndCheckTypes'
import { setPropDefault } from './defaults'
import { deleteOrphantProps } from './deleteOrphants'
import { connectionRequired } from './required'
import { hasWarings } from './warnings'

export default function (versions: CompVersions, props: Props) {
	if (!hasWarings(props.noodlNode)) {
		let resultProps: Props = props

		if (props.version) {
			const nodeInputs = versions[props.version]?.inputs || []

			nodeInputs.forEach((nodeInput) => {
				const n = nodeInput.name
				let p = props[n]

				p = setPropDefault(nodeInput, p)
				p = convertAndCheckProp(props.noodlNode.model, props.noodlNode.context, nodeInput, p)
				resultProps[n] = p
			})

			resultProps = deleteOrphantProps([...nodeInputs, ...(versions[props.version]?.outputs || [])], resultProps)

			connectionRequired(props.noodlNode, nodeInputs, resultProps)
		}

		return resultProps
	} else return props
}
