import { Button } from '@mantine/core'
import { sendSignal } from '@shared/port-send-v1.0.0'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	const size = p.compact ? `compact-${p.sizeProp}` : p.sizeProp

	const children: any = p.children

	const leftSection = Array.isArray(children)
		? children.filter((i) => i?.props.noodlNode.model?.type.split('.')[2] === 'ButtonLeftSection')?.[0]
		: children?.props.noodlNode.model?.type.split('.')[2] === 'ButtonLeftSection'
			? children
			: null

	const rightSection = Array.isArray(children)
		? children.filter((i) => i?.props.noodlNode.model?.type.split('.')[2] === 'ButtonRightSection')?.[0]
		: children?.props.noodlNode.model?.type.split('.')[2] === 'ButtonRightSection'
			? children
			: null

	return (
		<Button
			component={p.href ? 'a' : undefined} // Превращаем в ссылку, если есть href.
			target="_blank" // Ссылка в новом табе.
			data-disabled={p.disabled} // Когда component='a', обычный disabled не работает. Так же без этог не будет работать Tooltip.
			type={p.submitType ? 'submit' : undefined}
			size={size}
			leftSection={leftSection}
			rightSection={rightSection}
			onClick={(e) => {
				e.stopPropagation()
				if (!p.disabled) sendSignal(p.noodlNode, 'clicked') // Проверка на disabled нужна, когда ссылка.
			}}
			{...p}
			{...p.customProps}
		>
			{p.label}
		</Button>
	)
})
