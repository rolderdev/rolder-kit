import { forwardRef } from 'react'
import { Divider } from '@mantine/core';

const Comp = forwardRef(function (props: any) {
  const { dividerVariant, dividerLabelPosition, dividerOrientation } = props

  return <Divider variant={dividerVariant} labelPosition={dividerLabelPosition} orientation={dividerOrientation} {...props} />
})

export default Comp