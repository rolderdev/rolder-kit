import { forwardRef, useState } from 'react'
import { TextInput, CloseButton } from '@mantine/core'
import { useShallowEffect, useDebouncedValue } from '@mantine/hooks'
import icons from '../../../../../../libs/icons/v0.2.0/icons'
import { sendOutput } from '../../../../../../main/ports/send/v0.3.0/send'
import { useFormContextWitchCheck } from '../../../../../../libs/contenxt/form/v0.1.0/useForm'

const Comp = forwardRef(function (props: any) {
  const { iconName, iconSize, formField, useForm } = props
  const Icon = icons(iconName)

  const [value, setValue] = useState<string | number>('')
  const formHook: any = useForm ? useFormContextWitchCheck() : undefined

  const typingDelay = props.debouncedTyping ? props.typingDelay : 0
  const [debouncedTyping] = useDebouncedValue(value, typingDelay)
  useShallowEffect(() => sendOutput(props.node, 'typedValue', debouncedTyping), [debouncedTyping])

  const validationDelay = props.debouncedValidation ? props.validationDelay : 0
  const [debouncedValidation] = useDebouncedValue(value, validationDelay)
  useShallowEffect(() => {
    if (useForm) if (props.validationType === 'onChange' && debouncedValidation) formHook.validateField(formField)
  }, [debouncedValidation])
  
  return (
    <TextInput
      value={useForm ? formHook?.values[formField] : value}
      icon={Icon && <Icon size={iconSize} />}
      rightSection={<CloseButton onClick={() => {
        formHook?.setFieldValue(formField, '')
        setValue('')
      }} />}
      error={formHook?.errors[formField]}
      onChange={(e) => {
        formHook?.setFieldValue(formField, e.target.value)
        setValue(e.target.value)
      }}
      onBlurCapture={() => { if (props.validationType === 'onBlur' && useForm) formHook.validateField(formField) }}
      {...props}
    />
  )
})

export default Comp