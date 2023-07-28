import { Text, UnstyledButton, Divider, Stack } from "@mantine/core"

function HeaderItems(props) {
  function Item(item) {
    return (
      <UnstyledButton
        h='100%'
        onClick={() => props.sendHeaderItem(item)}
      >
        <Stack justify="flex-end" spacing='none' h='100%'>
          <Stack justify="space-between" spacing='none' h='75%'>
            <Text>{item.label}</Text>
            {item.path === props.selectedHeaderItem?.path && <Divider size="md" color='red' />}
          </Stack>
        </Stack>
      </UnstyledButton>
    )
  }

  const items = props.items.map((item) => Item(item))
  return items
}

export default HeaderItems