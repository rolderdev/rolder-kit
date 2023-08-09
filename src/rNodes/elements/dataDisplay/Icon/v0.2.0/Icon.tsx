import icons from "../../../../../libs/icons/v0.2.0/icons"

export default function Icon_v0_2_0(props: any) {
  const Icon = props.iconName && icons(props.iconName)
  return Icon ? <Icon {...props} sx={{ ...props.sx?.[0] }} /> : <></>
}