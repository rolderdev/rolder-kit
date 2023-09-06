import { Drawer, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { forwardRef, useImperativeHandle } from 'react'
import sendSignal from '../../../../../utils/noodl/v0.1.0/sendSignal'

const Comp = forwardRef(function (props: any, ref) {
  const { children, drawerTitle, sizeUnits, noodlNode, drawerPosition, drawerTitleOrder, drawerHeaderEnabled, closeActionEnabled } = props

  if (sizeUnits) props.size = sizeUnits

  const [opened, { open, close }] = useDisclosure(false)
  // signals
  useImperativeHandle(ref, () => ({ open() { open() }, close() { close() }, }), [])

  return (
    <Drawer.Root
      opened={opened}
      onClose={() => {
        close()
        sendSignal({ noodlNode, portName: 'closed' })
      }}
      overlayProps={{ opacity: 0.5, blur: 2 }}
      position={drawerPosition}
      {...props}
    >
      <Drawer.Overlay />
      <Drawer.Content>
        {drawerHeaderEnabled && <Drawer.Header>
          {drawerTitle && <Drawer.Title><Title order={drawerTitleOrder}>{drawerTitle}</Title></Drawer.Title>}
          {closeActionEnabled && <Drawer.CloseButton />}
        </Drawer.Header>}
        <Drawer.Body>{children}</Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
})

export default Comp