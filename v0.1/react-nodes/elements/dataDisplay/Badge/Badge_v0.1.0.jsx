import { Badge, Avatar } from "@mantine/core"
import Icons from '../../../../libs/icons/Icons_v0.1.0'

export default function Badge_v0_1_0(props) {
  const Icon = props.iconName && Icons(props.iconName)
  const avatar = (
    <Avatar size={24} mr={5}>
      <Icon size={props.iconSize} />
    </Avatar>
  )
  return (
    <Badge pl={props.iconName && 0} leftSection={props.iconName && avatar} {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      {props.value}
    </Badge>
  )
}