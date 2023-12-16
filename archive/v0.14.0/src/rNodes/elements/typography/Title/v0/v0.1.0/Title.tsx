import { Title } from '@mantine/core'
import { forwardRef } from 'react'

const Comp = forwardRef(function (props: any) {
  const { value, titleOrder } = props

  return <Title order={titleOrder}>{value}</Title>
})

export default Comp