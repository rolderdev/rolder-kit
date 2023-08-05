import Icons from "../../../../../libs/icons/v0.1.0/Icons"

export default function Icon_v0_1_0(props: any) {
  const Icon = props.iconName && Icons(props.iconName)
  return Icon ? <Icon {...props} sx={{ ...props.sx?.[0] }} /> : <></>
}