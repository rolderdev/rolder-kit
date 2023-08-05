import { NavLink } from '@mantine/core'
import Icons from '../../../../libs/icons/v0.1.0/Icons'

function NavbarItems(props: any) {
  function Item(item: any) {
    const Icon = item.iconName && Icons(item.iconName)
    return (
      <NavLink
        key={item.label}
        active={item.path === props.selectedNavbarItem?.path}
        label={item.label}
        color={item.color}
        icon={<Icon size="1rem" />}
        onClick={() => props.sendNavbarItem(item)}
      />
    )
  }

  const items = props.items.map((item: any) => Item(item))
  return items
}

export default NavbarItems