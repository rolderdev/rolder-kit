import { Image } from '@mantine/core'

export default function Image_v0_1_0(props: any) {
  return <Image src={props.sourceUrl} {...props} sx={{ ...props.sx?.[0] }} />
}