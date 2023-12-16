import { Popover, ActionIcon } from '@mantine/core'
import Icons from '../../../../../libs/icons/v0.1.0/Icons'

export default function PopoverActionIcon_v0_1_1(props: any) {
  const Icon = props.iconName && Icons(props.iconName) || Icons('IconGhostFilled')

  return (
    <Popover {...props}>
      <Popover.Target>
        <ActionIcon {...props} >
          <Icon size={props.iconSize} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        {props.children}
      </Popover.Dropdown>
    </Popover >
  )
}