import { Text } from '@mantine/core'
import { forwardRef } from 'react'
import { getMasked } from '../../../../../../utils/data/v0.3.0/data'

const Comp = forwardRef(function (props: any) {
  const value = props.masked && props.textMask ? getMasked(props.value, props.textMask) : props.value

  return <Text {...props}>{value}</Text>
})

export default Comp