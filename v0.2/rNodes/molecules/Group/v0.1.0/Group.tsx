import { Group } from '@mantine/core'

export default function Group_v0_1_0(props: any) {
  return (
    <Group {...props} sx={{ ...props.sx?.[0] }}>
      {props.children}
    </Group>
  )
}