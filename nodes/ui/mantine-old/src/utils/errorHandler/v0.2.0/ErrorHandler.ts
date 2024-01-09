import { notifications } from '@mantine/notifications'

export default function ErrorHandler(title?: string, message?: string, autoClose?: boolean | number): void {
    notifications.show({ title, message, color: 'red', autoClose: autoClose ? autoClose : false })
}