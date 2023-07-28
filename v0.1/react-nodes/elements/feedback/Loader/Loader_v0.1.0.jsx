import { Loader } from "@mantine/core"

export default function Loader_v0_1_0(props) {
  return (
    <Loader {...props} sx={props.sx?.length && { ...props.sx[0] }} />
  )
}