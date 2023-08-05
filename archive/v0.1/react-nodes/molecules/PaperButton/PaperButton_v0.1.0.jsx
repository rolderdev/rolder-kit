import { Paper, UnstyledButton } from '@mantine/core'

export default function PaperButton_v0_1_0(props) {
  return (
    <UnstyledButton onClick={() => props.sendSelected()}>
      <Paper {...props} sx={props.sx?.length && { ...props.sx[0] }}>
        {props.children}
      </Paper>
    </UnstyledButton>
  )
}