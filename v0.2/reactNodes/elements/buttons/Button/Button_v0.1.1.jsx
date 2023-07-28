import { Button } from "@mantine/core"
import Icons from '../../../../libs/icons/Icons_v0.1.0'

export default function Button_v0_1_1(props) {
  const { value, iconName, iconSize, isLoading } = props
  console.log(props)
  const Icon = iconName && Icons(iconName)
  return (
    <Button
      leftIcon={iconName && <Icon size={iconSize} />}
      loading={isLoading}
      onClick={() => props.sendClicked()}
      {...props}
      sx={props.sx?.length && { ...props.sx[0] }}
    >
      {value}
    </Button>
  )
}