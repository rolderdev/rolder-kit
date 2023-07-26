import { Textarea } from '@mantine/core'

export default function Textarea_v0_1_0(props) {
  const { formHook, formField } = props

  return (
    <Textarea
      {...props}
      {...formHook?.getInputProps(formField)}
    />
  )
}