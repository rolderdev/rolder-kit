import { notifications } from '@mantine/notifications'

export default function ErrorHandler({ title, message }: { title?: string, message?: string }): void {
    notifications.show({ title, message, color: 'red', autoClose: false })
}