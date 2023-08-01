import { ScrollArea } from '@mantine/core'
import { useShallowEffect, useViewportSize } from '@mantine/hooks'
import { useState } from 'react'

export default function ScrollArea_v0_1_0(props: any) {
  const { children, bottomOffset } = props

  const { height: viewPortHeight } = useViewportSize()
  const [height, setHeight] = useState(0)
  useShallowEffect(() => {
    if (viewPortHeight > 0) {
      const scrollHeight = viewPortHeight - bottomOffset
      setHeight(scrollHeight)
    }
  }, [viewPortHeight])

  return (
    <ScrollArea.Autosize mah={height} {...props} sx={{ ...props.sx?.[0] }}>
      {children}
    </ScrollArea.Autosize>
  )
}