import { Select } from '@mantine/core'
import { useState } from 'react'
import { convertForSelect } from '../../../../utils/data/v.0.1.0/data'
import { useShallowEffect } from '@mantine/hooks'
import create from '../../../../libs/kuzzle/v0.0.6/create'

export default function Select_v0_2_0(props) {
  const { inputItems, useForm, formHook, labelField, formField, value } = props
  // doesn't render without this
  //const convertedItems = inputItems?.map(i => convertForSelect(i, labelField))

  const [data, setData] = useState([])
  useShallowEffect(() => {
    setData(useForm ? inputItems?.map(i => convertForSelect(i, labelField)) : inputItems)
  }, [inputItems])

  useShallowEffect(() => {
    props.sendSelected()
  }, [value, formHook?.values[formField]])

  return <Select
    nothingFound="Не найдено"
    getCreateLabel={(value) => `+ Создать "${value}"`}
    onCreate={(value) => {
      props.createValue(value)
      props.doCreate()
    }}
    value={value}
    data={data}
    {...props}
    {...formHook?.getInputProps(formField)}
  />
}