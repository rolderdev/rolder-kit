import { TextInput, CloseButton } from '@mantine/core'
import { useShallowEffect, useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import Icons from '../../../../../libs/icons/v0.1.0/Icons'

export default function TextInput_v0_2_0(props: any) {
  const { iconName, iconSize, formHook, formField, debounced, delay } = props
  const Icon = iconName && Icons(iconName)

  const [value, setValue] = useState('')
  useShallowEffect(() => {
    if (!debounced) props.inputString(value)
  }, [value])

  const [debouncedValue] = useDebouncedValue(value, delay)
  useShallowEffect(() => {
    if (debounced) props.inputString(debouncedValue)
  }, [debouncedValue])

  return (
    <TextInput
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      icon={Icon && <Icon size={iconSize} />}
      rightSection={<CloseButton onClick={() => {
        setValue('')
        formHook?.setValues({ [formField]: '' })
        props.inputString('')
      }} />}
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
}