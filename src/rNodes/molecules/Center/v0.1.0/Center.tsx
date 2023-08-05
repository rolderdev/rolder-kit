import { Center } from '@mantine/core'

export default function Center_v0_1_0(props: any) {
  return (
    <Center {...props} sx={{ ...props.sx?.[0] }}>
      {props.children}
    </Center>
  )
}