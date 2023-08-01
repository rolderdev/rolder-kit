import { Grid } from '@mantine/core'

export default function Grid_v0_1_0(props: any) {
  return (
    <Grid {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      {props.children?.map((child: any, idx: number) => <Grid.Col span={props.spans[idx]}>{child}</Grid.Col>)}
    </Grid>
  )
}