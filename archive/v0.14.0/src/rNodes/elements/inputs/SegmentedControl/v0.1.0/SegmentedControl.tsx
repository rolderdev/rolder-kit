import { SegmentedControl } from '@mantine/core'
import { useState } from 'react'

export default function SegmentedControl_v0_1_0(props: any) {
  const { inputItems, formHook, formField, value } = props
  props.orientation = props.orientation && 'vertical'

  const [localValue, setLocalValue] = useState(inputItems?.[0].value)

  return (
    <SegmentedControl
      value={value || localValue}
      data={inputItems || []}
      onChange={(v) => {
        props.selectedValue(v)
        setLocalValue(v)
      }}
      {...props}
      {...formHook?.getInputProps(formField)}
      sx={{ ...props.sx?.[0] }}
    />
  )
}