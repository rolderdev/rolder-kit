import { Anchor } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, useEffect, useState } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props, ref) => {
	const { numbro } = R.libs
	const { getValue, getMasked, getFormatedDate } = R.utils

	const p = { ...getCompProps(props, props.itemSource) } as Props
	const { itemSource } = p

	const [value, setValue] = useState('')

	const valueSource =
		p.dataSource === 'item'
			? typeof getValue.v8(itemSource, p.sourceField) === 'number'
				? String(getValue.v8(itemSource, p.sourceField))
				: getValue.v8(itemSource, p.sourceField)
			: typeof p.valueSource === 'number'
				? String(p.valueSource)
				: p.valueSource

	const link = p.linkFromItem ? getValue.v8(itemSource, p.linkField) : p.link

	useEffect(() => {
		if (valueSource)
			switch (p.textFormat) {
				case 'none':
					setValue(valueSource)
					break
				case 'number':
					setValue(numbro(valueSource || 0).format(p.numberFormat))
					break
				case 'date':
					setValue(getFormatedDate.v2({ valueSource }, 'valueSource', p.dateFormat) || '')
					break
				case 'mask':
					setValue(getMasked.v2({ type: 'pattern', maskPattern: p.textMask }, valueSource) || '')
					break
			}
	}, [valueSource])

	return (
		<Anchor
			href={link}
			target="_blank"
			lineClamp={3}
			{...p}
			truncate={p.truncate === 'disabled' ? undefined : p.truncate}
			{...props.customProps}
		>
			{value}
		</Anchor>
	)
})
