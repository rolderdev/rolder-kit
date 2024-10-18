import { Select } from '@mantine/core'
import convertColor from '@packages/convert-color'
import convertForSelectInputs from '@packages/convert-for-select-inputs'
import getValue from '@packages/get-value'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const Icon = props.iconName && R.libs.icons[props.iconName]
	const { noodlNode, inputItems, labelField, defaultItem } = props

	const defaultValue = defaultItem?.value || defaultItem?.label || defaultItem?.id || null

	const [data, setData] = useState<any>([])
	useEffect(() => {
		if (!inputItems?.length) setData([])
		if (inputItems && labelField && inputItems?.some((i: any) => getValue(i, labelField))) {
			const convertedItems = inputItems.map((i) => convertForSelectInputs(i, labelField))
			setData(convertedItems.filter((i) => i && i.label && i.value))
		}
	}, [inputItems, labelField])

	const [value, setValue] = useState<string | null>(null)
	useEffect(() => {
		if (defaultValue) {
			setValue(defaultValue)
			const selectedItem = inputItems?.find((i) => defaultValue && [i.value, i.id, i.label].includes(defaultValue))
			sendOutput(noodlNode, 'selectedItem', selectedItem)
		}
	}, [defaultValue])

	useImperativeHandle(
		ref,
		() => ({
			resetSelected() {
				setValue(null)
				sendSignal(noodlNode, 'reseted')
			},
		}),
		[]
	)

	return (
		<Select
			nothingFound="Не найдено"
			getCreateLabel={(value) => `+ Создать "${value}"`}
			onCreate={(value) => {
				sendOutput(noodlNode, 'newValue', value)
				sendSignal(noodlNode, 'newValueSubmited')
				return undefined
			}}
			data={data}
			value={value}
			icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
			error={props.inputError || false}
			onChange={(v) => {
				if (!v) {
					setValue(null)
					sendOutput(noodlNode, 'selectedItem', null)
					sendSignal(noodlNode, 'reseted')
				} else {
					setValue(v)
					const selectedItem = inputItems?.find((i) => v && [i.value, i.id, i.label].includes(v))
					sendOutput(noodlNode, 'selectedItem', selectedItem)
					sendSignal(noodlNode, 'selected')
				}
			}}
			styles={() => ({
				item: {
					'&[data-selected]': { '&, &:hover': { backgroundColor: convertColor(props.backgroundColor) } },
					'&[data-hovered]': {},
				},
			})}
			{...props}
			{...props.customProps}
		/>
	)
})
