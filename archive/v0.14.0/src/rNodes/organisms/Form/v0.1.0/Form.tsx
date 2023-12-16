import { useForm, isNotEmpty } from "@mantine/form"
import { useShallowEffect } from '@mantine/hooks'
import { useState } from 'react'

function Comp(props: any) {
  const { scheme } = props

  const form = useForm(scheme)
  props.formHook(form)

  return (
    <form onSubmit={form.onSubmit(() => props.submited())}>
      {props.children}
    </form>
  )
}

export default function Form_v0_1_0(props: any) {
  const { formScheme } = props

  const [scheme, setScheme] = useState<any>(undefined)
  useShallowEffect(() => {
    if (formScheme) {
      const initialValues: any = {}
      formScheme.forEach((fs: any) => {
        let initialValue: any = ''
        if (Array.isArray(fs.initialValue)) initialValue = fs.initialValue || []
        initialValues[fs.name] = fs.initialValue || initialValue
      })

      const validate: any = {}
      formScheme.forEach((fs: any) => {
        let val: any = null
        switch (fs.validate) {
          case 'isNotEmpty': val = isNotEmpty(); break
          case 'function': val = fs.function; break
        }
        if (val) validate[fs.name] = val
      })

      setScheme({ initialValues, validate })
    }
  }, [formScheme])

  return scheme ? <Comp scheme={scheme} {...props} /> : <></>
}