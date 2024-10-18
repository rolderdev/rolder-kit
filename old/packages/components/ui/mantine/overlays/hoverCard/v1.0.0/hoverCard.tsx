import { Box, HoverCard } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from './types'

const Target = forwardRef((props, ref: any) => <Box ref={ref} {...props} w="fit-content" />)

export default forwardRef((props: Props) => {
	const children: any = props.children

	const target = Array.isArray(children)
		? children.filter((i) => i.props.noodlNode.model?.type.split('.')[1] === 'HoverCardTarget')?.[0]
		: children?.props.noodlNode.model?.type.split('.')[1] === 'HoverCardTarget'
			? children
			: null

	const dropdown = Array.isArray(children)
		? children.filter((i) => i.props.noodlNode.model?.type.split('.')[1] === 'HoverCardDropdown')?.[0]
		: children?.props.noodlNode.model?.type.split('.')[1] === 'HoverCardDropdown'
			? children
			: null

	return target ? (
		<HoverCard {...props} {...props.customProps}>
			<HoverCard.Target>
				{
					//@ts-ignore
					<Target children={target} />
				}
			</HoverCard.Target>
			<HoverCard.Dropdown>{dropdown}</HoverCard.Dropdown>
		</HoverCard>
	) : null
})
