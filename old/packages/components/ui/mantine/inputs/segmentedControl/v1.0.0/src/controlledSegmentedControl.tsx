import { SegmentedControl } from '@mantine/core'
import convertForSelectInputs from '@packages/convert-for-select-inputs'
import getValue from '@packages/get-value'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useState } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props) => {
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

	const [value, setValue] = useState<string | undefined>()
	useEffect(() => {
		if (defaultValue) setValue(defaultValue)
	}, [defaultValue])
	useEffect(() => {
		if (value) {
			const selectedItem = inputItems?.find((i: any) => value && [i.value, i.id, i.label].includes(value))
			sendOutput(noodlNode, 'selectedItem', selectedItem)
			sendSignal(noodlNode, 'selected')
		}
	}, [value])

	return <SegmentedControl data={data} value={value} onChange={setValue} {...props} {...props.customProps} />
})
