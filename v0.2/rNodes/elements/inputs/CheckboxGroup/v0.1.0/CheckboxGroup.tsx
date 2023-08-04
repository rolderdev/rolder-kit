import { Group, Checkbox, Stack, Box, Text } from '@mantine/core'

export default function CheckboxGroup_v0_1_0(props: any) {
  const { inputItems, formHook, formField, direction, grow, spacing, disabled } = props

  return (
    <Checkbox.Group {...props} {...formHook?.getInputProps(formField)} sx={{ ...props.sx?.[0] }}>
      {direction === 'row'
        ?
        <Group grow={grow} mr='-1rem' mb='1rem'>
          {inputItems?.map((i: any) => <Box><Text fz="sm">{i.label}</Text><Checkbox mt={8} value={i.value} disabled={disabled} /></Box>)}
        </Group>
        :
        <Stack spacing={spacing}>
          {inputItems?.map((i: any) => <Box><Text fz="sm">{i.label}</Text><Checkbox mt={8} value={i.value} disabled={disabled} /></Box>)}
        </Stack>
      }
    </Checkbox.Group>
  )
}