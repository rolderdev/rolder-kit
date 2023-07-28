import { MultiSelect } from '@mantine/core'
import { convertForSelect } from '../../../../utils/data/v.0.1.0/data'
import { useShallowEffect } from '@mantine/hooks'

export default function MultiSelect_v0_1_0(props) {
  const { inputItems, useForm, formHook, labelField, formField, value } = props
  // doesn't render without this
  const convertedItems = inputItems?.map(i => convertForSelect(i, labelField))
  useShallowEffect(() => {
    props.sendSelected()
  }, [value, formHook?.values[formField]])

  return (
    <MultiSelect
      nothingFound="Не найдено"
      value={value}
      data={useForm && inputItems ? inputItems : inputItems?.map(i => convertForSelect(i, labelField)) || []}
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
}