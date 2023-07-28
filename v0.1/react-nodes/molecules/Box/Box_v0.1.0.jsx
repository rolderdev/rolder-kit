import { Box } from '@mantine/core'
import { useShallowEffect, useViewportSize } from '@mantine/hooks'
import { useState } from 'react'

export default function Box_v0_1_0(props) {
  const { width, autoHeight, bottomOffset } = props

  const { height: viewPortHeight } = useViewportSize()
  const [height, setHeight] = useState(undefined)
  useShallowEffect(() => {
    if (autoHeight) {
      if (viewPortHeight > 0) setHeight(viewPortHeight - bottomOffset)
    } else setHeight(props.height)
  }, [viewPortHeight])

  const sx = {
    width, height,
    ...props.sx?.[0]
  }
  return (
    <Box sx={sx}>
      {props.children}
    </Box>
  )
}