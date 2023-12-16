import { ActionIcon } from "@mantine/core"
import icons from "../../../../../libs/icons/v0.2.0/icons"

export default function ActionIcon_v0_1_1(props: any) {
  const Icon = props.iconName ? icons(props.iconName) : icons('IconGhostFilled')
  return (
    <ActionIcon {...props} sx={props.sx?.length && { ...props.sx[0] }} onClick={() => props.clicked()}>
      <Icon size={props.iconSize} />
    </ActionIcon>
  )
}