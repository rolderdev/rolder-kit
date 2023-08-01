import { ActionIcon } from "@mantine/core"
import Icons from "../../../../../libs/icons/v0.1.0/Icons"

export default function ActionIcon_v0_1_1(props: any) {
  const Icon = props.iconName ? Icons(props.iconName) : Icons('IconGhostFilled')
  return (
    <ActionIcon {...props} sx={props.sx?.length && { ...props.sx[0] }} onClick={() => props.clicked()}>
      <Icon size={props.iconSize} />
    </ActionIcon>
  )
}