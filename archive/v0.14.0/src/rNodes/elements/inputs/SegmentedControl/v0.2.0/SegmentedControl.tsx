import { SegmentedControl } from '@mantine/core'
import { useState } from 'react'
import { convertForSelect } from '../../../../../utils/data/v0.3.0/data'
import { useShallowEffect } from '@mantine/hooks'

export default function SegmentedControl_v0_2_0(props: any) {
  const { items, customItems, useCustomItems, formHook, labelField, formField, selectedInputItem } = props
  props.orientation = props.orientation && 'vertical'

  const [data, setData] = useState([])
  useShallowEffect(() => {
    if (!useCustomItems && !labelField) console.warn('Node Select must have "Label field" to parse items')
    setData(useCustomItems ? customItems || [] : items?.map((i: any) => convertForSelect(i, labelField)) || [])
  }, [items, customItems])

  function sendSelected(item: any) {
    props.selected()
    props.selectedItem(item || null)
  }
  // form
  useShallowEffect(() => {
    const formValue = formHook?.values[formField]
    sendSelected(data.find((i: any) => i.id === formValue || i.value === formValue))
  }, [formHook?.values[formField]])

  // controlled
  const [value, setValue] = useState(undefined)
  useShallowEffect(() => {
    const selectedInputValue = selectedInputItem?.id || selectedInputItem?.value
    setValue(selectedInputValue)
    sendSelected(data.find((i: any) => i.id === selectedInputValue || i.value === selectedInputValue))
  }, [selectedInputItem])


  return (
    <SegmentedControl
      value={value}
      data={data}
      onChange={(value: any) => {
        const selectedItem = data.find((i: any) => i.id === value || i.value === value)
        setValue(value)
        sendSelected(selectedItem)
      }}
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
}