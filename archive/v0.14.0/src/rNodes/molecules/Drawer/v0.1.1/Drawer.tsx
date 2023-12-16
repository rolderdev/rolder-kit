import { useDisclosure, useShallowEffect } from '@mantine/hooks'
import { Drawer, Text } from '@mantine/core'

export default function Drawer_v0_1_1(props: any) {
  const { children, show, title, sizeUnits } = props

  if (sizeUnits) props.size = sizeUnits

  const [opened, { open, close }] = useDisclosure(false)
  useShallowEffect(() => {
    if (show) open()
    else close()
  }, [show])
  useShallowEffect(() => {
    if (!opened) props.hided()
  }, [opened])

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={<Text fw={700}>{title}</Text>}
      overlayProps={{ opacity: 0.5, blur: 2 }}
      children={children}
      {...props}
    >
    </Drawer>
  )
}