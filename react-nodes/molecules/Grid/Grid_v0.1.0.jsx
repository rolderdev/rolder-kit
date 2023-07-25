import { Grid } from '@mantine/core'

export default function Grid_v0_1_0(props) {
  if (!Array.isArray(props.children)) {
    console.warn('Grid needs at least 2 children')
    return <></>
  }
  else return (
    <Grid {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      {props.children?.map((child, idx) => <Grid.Col span={props.spans[idx]}>{child}</Grid.Col>)}
    </Grid>
  )
}