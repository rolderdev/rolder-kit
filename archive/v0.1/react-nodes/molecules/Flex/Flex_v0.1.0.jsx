import { Flex } from '@mantine/core'

export default function Flex_v0_1_0(props) {
  return (
    <Flex {...props} sx={{ ...props.sx?.[0] }}>
      {props.children}
    </Flex>
  )
}