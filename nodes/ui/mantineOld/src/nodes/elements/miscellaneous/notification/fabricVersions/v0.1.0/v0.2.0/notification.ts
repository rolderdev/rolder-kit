import { notifications } from "@mantine/notifications"

export default {
  signals: {
    send: (noodlNode: NoodlNode) => {
      const { title, message, color, autoClose, autoCloseTimeout } = noodlNode.resultProps

      notifications.show({ title, message, color, autoClose: autoClose ? autoCloseTimeout : false })
    }
  }
}