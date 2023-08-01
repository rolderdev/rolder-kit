import { Button } from "@mantine/core"
import Icons from "../../../../../libs/icons/v0.1.0/Icons"

export default function Button_v0_1_1(props: any) {
  const { label, iconName, iconSize } = props

  const Icon = iconName && Icons(iconName)
  return (
    <Button
      leftIcon={iconName && <Icon size={iconSize} />}
      onClick={() => props.sendClicked()}
      {...props}
      sx={{ ...props.sx?.[0] }}
    >
      {label}
    </Button>
  )
}