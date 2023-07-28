import { useForm, isNotEmpty } from "@mantine/form"
import { useShallowEffect } from '@mantine/hooks'
import { useState } from 'react'

function Comp(props) {
  const { scheme } = props

  const form = useForm(scheme)
  props.formHook(form)

  return (
    <form onSubmit={form.onSubmit(() => props.sendSubmited())}>
      {props.children}
    </form>
  )
}

export default function Form_v0_1_0(props) {
  const { formScheme } = props

  const [scheme, setScheme] = useState(undefined)
  useShallowEffect(() => {
    if (formScheme) {
      const initialValues = {}
      formScheme.forEach(fs => {
        initialValues[fs.name] = fs.initialValue || ''
      })

      const validate = {}
      formScheme.forEach(fs => {
        const val = null
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