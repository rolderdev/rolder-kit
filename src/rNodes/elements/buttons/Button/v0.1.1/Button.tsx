import { Button } from "@mantine/core"
import icons from "../../../../../libs/icons/v0.2.0/icons"

export default function Button_v0_1_1(props: any) {
  const { label, iconName, iconSize, buttonType, customSx } = props

  const Icon = iconName && icons(iconName)
  return (
    <Button
      type={buttonType}
      leftIcon={iconName && <Icon size={iconSize} />}
      onClick={() => props.clicked()}
      {...props}
      sx={{ ...props.sx?.[0], ...customSx?.[0] }}
    >
      {label}
    </Button>
  )
}