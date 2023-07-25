import { Avatar } from "@mantine/core"

export default function Avatar_v0_1_0(props) {
  return (
    <Avatar {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      {props.children}
    </Avatar>
  )
}