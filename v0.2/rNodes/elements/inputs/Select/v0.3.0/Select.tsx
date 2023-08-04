import { Select } from '@mantine/core'
import { useState } from 'react'
import { convertForSelect } from '../../../../../utils/data/v0.2.0/data'
import { useShallowEffect } from '@mantine/hooks'

export default function Select_v0_3_0(props: any) {
  const { items, customItems, useCustomItems, formHook, labelField, formField, selectedItem } = props

  const [data, setData] = useState([])
  useShallowEffect(() => {
    if (!useCustomItems && !labelField) console.warn('Node Select must have "Label field" to parse items')
    setData(useCustomItems ? customItems || [] : items?.map((i: any) => convertForSelect(i, labelField)) || [])
  }, [items, customItems])

  useShallowEffect(() => {
    props.selected()
  }, [selectedItem, formHook?.values[formField]])

  return <Select
    nothingFound="Не найдено"
    getCreateLabel={(value) => `+ Создать "${value}"`}
    onCreate={(value) => {
      props.createValue(value)
      props.create()
    }}
    value={selectedItem?.id}
    data={data}
    {...props}
    {...formHook?.getInputProps(formField)}
  />
}