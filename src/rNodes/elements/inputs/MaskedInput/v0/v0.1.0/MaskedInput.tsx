import { Input } from '@mantine/core';
import { useId, useShallowEffect } from '@mantine/hooks';
import { IMaskInput } from 'react-imask';
import { forwardRef, useState } from 'react'
import { useFormContext } from '../../../../../../libs/contenxt/form/v0.1.0/useForm';

const Comp = forwardRef(function (props: any) {
  const { label, hideMask, formField, withAsterisk } = props
  const id = useId();
  const formHook = useFormContext();

  const [value, setValue] = useState('')
  useShallowEffect(() => {
    if (!value && formHook?.values[formField]) setValue(formHook?.values[formField])
    else if (value && formHook) formHook.setFieldValue(formField, value)
  }, [value, formHook?.values[formField]])

  return (
    <Input.Wrapper id={id} label={label} withAsterisk={withAsterisk}>
      <Input<any>
        component={IMaskInput}
        lazy={hideMask}
        unmask={true}
        id={id}
        value={value}
        error={formHook?.errors[formField]}
        onAccept={(value: string) => setValue(value)}
        {...props}
      />
    </Input.Wrapper>
  )
})

export default Comp