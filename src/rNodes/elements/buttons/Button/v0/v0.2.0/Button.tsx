import { forwardRef } from 'react'
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { Button } from '@mantine/core';
import { sendSignal } from '../../../../../../utils/noodl/v0.1.0/send';

const Comp = forwardRef(function (props: any) {
  const { noodlNode, label, iconName, iconSize, stroke, buttonType, buttonVariant } = props
  const Icon = icons(iconName)

  return (
    <Button
      type={buttonType}
      variant={buttonVariant}
      leftIcon={Icon && <Icon size={iconSize} stroke={stroke} />}
      onClick={() => sendSignal({ noodlNode, portName: 'clicked' })}
      {...props}
    >
      {label}
    </Button>
  )
})

export default Comp