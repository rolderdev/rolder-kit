import { Popover, Text, ActionIcon, Button, Group } from '@mantine/core'
import { useState } from 'react'
import Icons from '../../../../libs/icons/Icons_v0.1.0'

export default function PopoverButton_v0_1_0(props) {
  const Icon = props.iconName && Icons(props.iconName)
  const Check = Icons('IconCheck')

  const [opened, setOpened] = useState(false)
  return (
    <Popover withArrow opened={opened} onChange={setOpened} {...props} sx={props.sx?.length && { ...props.sx[0] }}>
      <Popover.Target>
        <Button
          leftIcon={props.iconName && <Icon size={props.iconSize} />}
          onClick={() => { setOpened((o) => !o) }}
          {...props}
          sx={props.sx?.length && { ...props.sx[0] }}>
          {props.value}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Group>
          <Text size="sm">Уверены?</Text>
          <ActionIcon variant="filled" color='blue' type="submit" onClick={() => {
            props.sendClicked()
            setOpened((o) => !o)
          }} >
            <Check />
          </ActionIcon>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}