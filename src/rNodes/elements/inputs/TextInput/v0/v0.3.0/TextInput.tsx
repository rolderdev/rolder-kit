import { forwardRef, useState } from 'react'
import { TextInput, CloseButton } from '@mantine/core'
import { useShallowEffect, useDebouncedValue } from '@mantine/hooks'
import icons from '../../../../../../libs/icons/v0.2.0/icons'
import { sendOutput } from '../../../../../../main/ports/send/v0.3.0/send'
import { useFormContextWitchCheck } from '../../../../../../libs/contenxt/form/v0.1.0/useForm'

const Comp = forwardRef(function (props: any) {
  const { iconName, iconSize, formField, debounced, delay, node, useForm } = props
  const Icon = icons(iconName)
  const formHook: any = useForm ? useFormContextWitchCheck() : undefined

  const [value, setValue] = useState('')
  const [debouncedValue] = useDebouncedValue(value, delay)

  useShallowEffect(() => { if (!debounced || !value) sendOutput(node, 'typedValue', value) }, [value])
  useShallowEffect(() => { if (debounced && value) sendOutput(node, 'typedValue', debouncedValue) }, [debouncedValue])
  useShallowEffect(() => { setValue(formHook?.values[formField]) }, [formHook?.values[formField]])

  return (
    <TextInput
      value={value}
      icon={Icon && <Icon size={iconSize} />}
      rightSection={<CloseButton onClick={() => {
        setValue('')
        formHook?.setFieldValue(formField, '')
      }} />}
      onChange={(e) => setValue(e.target.value)}
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
})

export default Comp