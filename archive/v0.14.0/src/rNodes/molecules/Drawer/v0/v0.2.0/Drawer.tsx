import { Drawer, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { forwardRef, useImperativeHandle } from 'react'

const Comp = forwardRef(function (props: any, ref) {
  const { children, title, sizeUnits, noodlNode, drawerPosition } = props

  if (sizeUnits) props.size = sizeUnits

  const [opened, { open, close }] = useDisclosure(false)
  // signals
  useImperativeHandle(ref, () => ({ open() { open() }, close() { close() }, }), [])

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        close()
        if (noodlNode.hasOutput('hided')) noodlNode.sendSignalOnOutput('hided')
      }}
      title={<Title >{title}</Title>}
      overlayProps={{ opacity: 0.5, blur: 2 }}
      position={drawerPosition}
      children={children}
      {...props}
    >
    </Drawer>
  )
})

export default Comp