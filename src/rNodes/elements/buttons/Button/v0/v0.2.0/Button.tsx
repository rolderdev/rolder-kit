import { forwardRef } from 'react'
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { Button } from '@mantine/core';
import { sendSignal } from '../../../../../../main/ports/send/v0.3.0/send';

const Comp = forwardRef(function (props: any) {
  const { node, label, iconName, iconSize, stroke, buttonType, buttonVariant } = props
  const Icon = icons(iconName)

  return (
    <Button
      type={buttonType}
      variant={buttonVariant}
      leftIcon={Icon && <Icon size={iconSize} stroke={stroke} />}
      onClick={() => sendSignal(node, 'clicked')}
      {...props}
    >
      {label}
    </Button>
  )
})

export default Comp