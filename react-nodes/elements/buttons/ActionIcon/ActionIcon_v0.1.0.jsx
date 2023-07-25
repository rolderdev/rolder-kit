import { ActionIcon } from "@mantine/core"
import Icons from '../../../../libs/icons/Icons_v0.1.0'

export default function ActionIcon_v0_1_0(props) {
  const Icon = props.iconName ? Icons(props.iconName) : Icons('IconGhostFilled')
  return (
    <ActionIcon {...props} sx={props.sx?.length && { ...props.sx[0] }} onClick={() => props.sendClicked()}>
      <Icon size={props.iconSize} />
    </ActionIcon>
  )
}