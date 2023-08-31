import { forwardRef } from 'react'
import useFormScheme from './useFormScheme'

const Comp = forwardRef(function (props: any) {
  const { formScheme, noodlNode } = props

  const form = useFormScheme(formScheme)

  noodlNode.outputPropValues.formHook = form
  noodlNode.flagOutputDirty('formHook')

  if (form) return (
    <form onSubmit={form.onSubmit(() => noodlNode.sendSignalOnOutput('submited'))}>
      {props.children}
    </form>
  )
  else return <></>
})

export default Comp