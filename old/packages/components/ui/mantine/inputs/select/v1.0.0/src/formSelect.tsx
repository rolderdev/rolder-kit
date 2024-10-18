import { Select } from '@mantine/core'
import { usePrevious } from '@mantine/hooks'
import convertColor from '@packages/convert-color'
import convertForSelectInputs from '@packages/convert-for-select-inputs'
import getValue from '@packages/get-value'
import { sendOutput, sendSignal } from '@packages/port-send'
import { useFormScope } from '@packages/scope'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const Icon = props.iconName && R.libs.icons[props.iconName]
	const { noodlNode, inputItems, labelField, formField } = props
	const formHook = useFormScope()
	const value = formHook?.values?.[props.formField]

	const [data, setData] = useState<any>([])
	useEffect(() => {
		if (!inputItems?.length) setData([])
		if (inputItems && labelField && inputItems?.some((i: any) => getValue(i, labelField))) {
			const convertedItems = inputItems.map((i) => convertForSelectInputs(i, labelField))
			setData(convertedItems.filter((i) => i && i.label && i.value))
		}
	}, [inputItems, labelField])

	useEffect(() => {
		if (inputItems) {
			const value = formHook?.values?.[formField]
			const selectedItem = inputItems.find((i: any) => value && [i.value, i.id, i.label].includes(value))
			sendOutput(noodlNode, 'selectedItem', selectedItem || null)
			sendSignal(noodlNode, 'selected')
			if (!value) sendSignal(noodlNode, 'reseted')
		}
	}, [value])

	// reset
	useImperativeHandle(
		ref,
		() => ({
			resetSelected() {
				formHook?.setFieldValue(formField, null)
			},
		}),
		[]
	)

	return (
		<Select
			data={data}
			getCreateLabel={(value) => `+ Создать "${value}"`}
			onCreate={(value) => {
				sendOutput(noodlNode, 'newValue', value)
				sendSignal(noodlNode, 'newValueSubmited')
			}}
			icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
			nothingFound="Не найдено"
			styles={() => ({
				item: {
					'&[data-selected]': { '&, &:hover': { backgroundColor: convertColor(props.backgroundColor) } },
					'&[data-hovered]': {},
				},
			})}
			{...props}
			{...props.customProps}
			{...formHook?.getInputProps(formField)}
		/>
	)
})
