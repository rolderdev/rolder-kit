import { Text } from "@mantine/core"

export default function Text_v0_2_1(props: any) {
  return (
    <Text {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      {props.value}
    </Text>
  )
}