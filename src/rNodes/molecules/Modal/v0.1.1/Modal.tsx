import { Modal } from '@mantine/core'
import { useDisclosure, useShallowEffect } from '@mantine/hooks'

export default function Modal_v0_1_0(props: any) {
  const { show, children } = props
  const [opened, { open, close }] = useDisclosure(false)

  useShallowEffect(() => {
    if (show) open()
    else close()
  }, [show])
  useShallowEffect(() => {
    if (!opened) props.hided()
  }, [opened])

  return (
    <Modal
      centered
      opened={opened}
      onClose={close}
      {...props}
    >
      {children}
    </Modal>

  )
}