import { Stack } from '@mantine/core'

export default function Stack_v0_1_0(props: any) {
  return (
    <Stack {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      {props.children}
    </Stack>
  )
}