import { Avatar } from "@mantine/core"

export default function Avatar_v0_1_0(props: any) {
  return (
    <Avatar {...props} sx={{ ...props.sx?.[0] }}>
      {props.children}
    </Avatar>
  )
}