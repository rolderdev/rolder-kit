import { Center } from '@mantine/core'

export default function Center_v0_1_0(props) {
  return (
    <Center {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      {props.children}
    </Center>
  )
}