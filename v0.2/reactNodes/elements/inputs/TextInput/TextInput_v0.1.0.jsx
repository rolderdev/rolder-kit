import { TextInput, CloseButton } from '@mantine/core'
import { useState } from 'react'
import Icons from '../../../../libs/icons/Icons_v0.1.0'

export default function TextInput_v0_1_0(props) {
  const { iconName, iconSize, formHook, formField } = props
  const Icon = iconName && Icons(iconName)
  const [value, setValue] = useState('')

  return (
    <TextInput
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value)
        props.inputString(event.currentTarget.value)
      }}
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