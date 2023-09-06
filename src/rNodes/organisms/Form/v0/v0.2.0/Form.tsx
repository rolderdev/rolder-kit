import { forwardRef } from 'react'
import sendOutput from '../../../../../utils/noodl/v0.1.0/sendOutput'
import { FormProvider, useForm } from './useForm'

const Comp = forwardRef(function (props: any) {
  const { formScheme, noodlNode } = props
  const form = useForm(formScheme)
  sendOutput({ noodlNode, portName: 'formHookAtForm', value: form })

  if (form) return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(() => noodlNode.sendSignalOnOutput('submited'))}>
        {props.children}
      </form>
    </FormProvider>
  )
  else return <></>
})

export default Comp