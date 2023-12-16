import { Badge, Avatar } from "@mantine/core"
import icons from "../../../../../libs/icons/v0.2.0/icons"

export default function Badge_v0_1_0(props: any) {
  const Icon = props.iconName && icons(props.iconName)
  const avatar = (
    <Avatar size={24} mr={5}>
      <Icon size={props.iconSize} />
    </Avatar>
  )
  return (
    <Badge pl={props.iconName && 0} leftSection={props.iconName && avatar} {...props} sx={{ ...props.sx?.[0] }}>
      {props.label}
    </Badge>
  )
}