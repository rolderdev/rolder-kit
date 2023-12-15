import { forwardRef } from 'react'
import { sendOutput, sendSignal } from '../../../../../main/ports/send/v0.3.0/send'
import { FormProvider, useForm } from '../../../../../libs/contenxt/form/v0.1.0/useForm'

const Comp = forwardRef(function (props: any) {
  const form = useForm(props.formScheme)
  
  sendOutput(props.node, 'formHookAtForm', form)

  if (form) return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(() => sendSignal(props.node, 'submited'))}>
        {props.children}
      </form>
    </FormProvider>
  )
  else return <></>
})

export default Comp