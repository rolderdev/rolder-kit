import { UnstyledButton } from '@mantine/core'

export default function UnstyledButton_v0_1_0(props: any) {
  return (
    <UnstyledButton onClick={() => props.clicked()}>
      {props.children}
    </UnstyledButton>
  )
}