import { notifications } from '@mantine/notifications';
import { Props } from './types';

export default {
  send(props: Props) {
    const { title, message, color, autoClose, autoCloseTimeout } = props

    notifications.show({ title, message, color, autoClose: autoClose ? autoCloseTimeout : false })
  }
}