import { CloseButton, Input } from '@mantine/core';
import { useDebouncedValue, useId, useShallowEffect } from '@mantine/hooks';
import { IMaskInput } from 'react-imask';
import { forwardRef, useState } from 'react'
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { sendOutput } from '../../../../../../main/ports/send/v0.3.0/send';
import { useFormContextWitchCheck } from '../../../../../../libs/contenxt/form/v0.1.0/useForm';

const Comp = forwardRef(function (props: any) {
  const { iconName, iconSize, label, formField, withAsterisk, useForm } = props
  const id = useId();
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

  let maskProps = {}
  switch (props.maskType) {
    case 'number': maskProps = {
      mask: Number,
      scale: props.numberScale,
      thousandsSeparator: props.thousandsSeparator,
      radix: props.radix,
      mapToRadix: ['.', ','],
    }; break
    default: maskProps = {
      mask: props.maskPattern,
      lazy: props.hideMaskPattern,
      overwrite: props.overwriteMaskPattern
    }
  }

  return (
    <Input.Wrapper id={id} label={label} withAsterisk={withAsterisk} error={props.inputError || formHook?.errors[formField]}>
      <Input<any>
        component={IMaskInput}
        unmask='typed'
        id={id}
        value={useForm ? formHook?.values[formField] : value}
        error={formHook?.errors[formField]}
        onAccept={(value: string | number) => {
          const parsedValue = value === 0 ? '' : value
          formHook.setFieldValue(formField, parsedValue)
          setValue(parsedValue)
        }}
        onBlurCapture={() => { if (props.validationType === 'onBlur' && useForm) formHook.validateField(formField) }}
        icon={Icon && <Icon size={iconSize} />}
        rightSection={<CloseButton onClick={() => {
          setValue('')
          formHook?.setFieldValue(formField, '')
        }} />}
        {...props}
        {...maskProps}
      />
    </Input.Wrapper>
  )
})

export default Comp