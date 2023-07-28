import { notifications } from '@mantine/notifications'

export default function ErrorHandler({ title, message }) {
    notifications.show({ title, message, color: 'red', autoClose: false })
}