import { forwardRef } from 'react'
import { sendOutput, sendSignal } from '../../../../../main/ports/send/v0.3.0/send'
import { FormProvider, useForm } from '../../../../../libs/contenxt/form/v0.1.0/useForm'

const Comp = forwardRef(function (props: any) {
  const { formScheme, node } = props
  const form = useForm(formScheme)
  sendOutput(node, 'formHookAtForm', form)
  
  if (form) return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(() => sendSignal(node, 'submited'))}>
        {props.children}
      </form>
    </FormProvider>
  )
  else return <></>
})

export default Comp