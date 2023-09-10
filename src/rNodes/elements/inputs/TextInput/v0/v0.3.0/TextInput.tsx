import { forwardRef, useState } from 'react'
import { TextInput, CloseButton } from '@mantine/core'
import { useShallowEffect, useDebouncedValue } from '@mantine/hooks'
import icons from '../../../../../../libs/icons/v0.2.0/icons'
import { useFormContextWitchCheck } from '../../../../../organisms/Form/v0/v0.2.0/useForm'
import { sendOutput } from '../../../../../../utils/noodl/v0.1.0/send'

const Comp = forwardRef(function (props: any) {
  const { iconName, iconSize, formField, debounced, delay, noodlNode, useForm } = props
  const Icon = icons(iconName)
  const formHook: any = useForm ? useFormContextWitchCheck() : undefined

  const [value, setValue] = useState('')
  const [debouncedValue] = useDebouncedValue(value, delay)

  useShallowEffect(() => { if (!debounced || !value) sendOutput({ noodlNode, portName: 'typedValue', value: value }) }, [value])
  useShallowEffect(() => { if (debounced && value) sendOutput({ noodlNode, portName: 'typedValue', value: debouncedValue }) }, [debouncedValue])
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