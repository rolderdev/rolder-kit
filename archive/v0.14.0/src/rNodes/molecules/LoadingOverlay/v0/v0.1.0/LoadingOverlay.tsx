import { Box, LoadingOverlay } from '@mantine/core'
import { forwardRef } from 'react'
import { convertColor } from '../../../../../utils/converters/v0.1.0/converters'

const Comp = forwardRef(function (props: any) {

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={props.loading}
        loaderProps={{ size: props.loaderSize, color: props.loaderColor, variant: props.loaderVariant }}
        overlayOpacity={props.overlayOpacity}
        overlayColor={convertColor(props.overlayColor)}
        overlayBlur={props.overlayBlur}
      />
      {props.children}
    </Box>
  )
})

export default Comp