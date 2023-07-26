import { Select } from '@mantine/core'
import { convertForSelect } from '../../../../utils/data/v.0.1.0/data'
import { useShallowEffect } from '@mantine/hooks'

export default function Select_v0_1_0(props) {
  const { inputItems, useForm, formHook, labelField, formField, value } = props
  // doesn't render without this
  const convertedItems = inputItems?.map(i => convertForSelect(i, labelField))
  useShallowEffect(() => {
    props.sendSelected()
  }, [value, formHook?.values[formField]])

  return <Select
    nothingFound="Не найдено"
    value={value}
    data={useForm && inputItems ? inputItems : convertedItems || []}
    {...props}
    {...formHook?.getInputProps(formField)}
  />
}