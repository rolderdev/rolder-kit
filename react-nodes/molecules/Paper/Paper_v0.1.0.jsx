import { Paper } from '@mantine/core'

export default function Paper_v0_1_0(props) {
  const { children, backgroundColor, colorShade } = props

  return (
    <Paper {...props} sx={(theme) => ({ backgroundColor: theme.colors[backgroundColor]?.[colorShade] })}>
      {children}
    </Paper>
  )
}