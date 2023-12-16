import { notifications } from '@mantine/notifications'

export default function ErrorHandler({ title, message, autoClose = false }: { title?: string, message?: string, autoClose?: boolean | number }): void {
    notifications.show({ title, message, color: 'red', autoClose })
}