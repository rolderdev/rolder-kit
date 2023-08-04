import { MultiSelect } from '@mantine/core'
import { convertForSelect } from '../../../../../utils/data/v0.2.0/data'
import { useShallowEffect } from '@mantine/hooks'

export default function MultiSelect_v0_1_0(props: any) {
  const { inputItems, useForm, formHook, labelField, formField, value } = props
  // doesn't render without this
  const convertedItems = inputItems?.map((i: any) => convertForSelect(i, labelField))
  useShallowEffect(() => {
    props.selected()
  }, [value, formHook?.values[formField]])

  return (
    <MultiSelect
      nothingFound="Не найдено"
      value={value}
      data={useForm && inputItems ? inputItems : convertedItems || []}
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
}