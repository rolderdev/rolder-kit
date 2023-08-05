import { notifications } from '@mantine/notifications'

export default function node(noodleNode: any) {
  notifications.show({
    title: noodleNode.inputs.title,
    message: noodleNode.inputs.message,
    color: noodleNode.inputs.color
  })
}