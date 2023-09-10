import { forwardRef, useImperativeHandle, useState } from 'react'
import icons from '../../../../../../libs/icons/v0.2.0/icons';
import { Button, Popover } from '@mantine/core';

const Comp = forwardRef(function (props: any, ref) {
  const { label, iconName, iconSize, stroke, buttonVariant, popoverPosition, children } = props
  const Icon = icons(iconName)

  const [opened, setOpened] = useState(false);
  // signals
  useImperativeHandle(ref, () => ({ close() { setOpened(false) }, }), [])

  return (
    <Popover
      position={popoverPosition}
      opened={opened} onChange={setOpened}
      {...props}
    >
      <Popover.Target>
        <Button
          variant={buttonVariant}
          leftIcon={Icon && <Icon size={iconSize} stroke={stroke} />}
          onClick={() => setOpened((o) => !o)}
          {...props}
        >
          {label}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        {children}
      </Popover.Dropdown>
    </Popover >
  )
})

export default Comp