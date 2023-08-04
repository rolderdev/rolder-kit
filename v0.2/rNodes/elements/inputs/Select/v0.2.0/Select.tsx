import { Select } from '@mantine/core'
import { useState } from 'react'
import { convertForSelect } from '../../../../../utils/data/v0.2.0/data'
import { useShallowEffect } from '@mantine/hooks'

export default function Select_v0_2_0(props: any) {
  const { inputItems, useForm, formHook, labelField, formField, value } = props

  const [data, setData] = useState([])
  useShallowEffect(() => {
    setData(useForm ? inputItems?.map((i: any) => convertForSelect(i, labelField)) : inputItems || [])
  }, [inputItems])

  useShallowEffect(() => {
    props.selected()
  }, [value, formHook?.values[formField]])

  return <Select
    nothingFound="Не найдено"
    getCreateLabel={(value) => `+ Создать "${value}"`}
    onCreate={(value) => {
      props.createValue(value)
      props.create()
    }}
    value={value}
    data={data}
    {...props}
    {...formHook?.getInputProps(formField)}
  />
}