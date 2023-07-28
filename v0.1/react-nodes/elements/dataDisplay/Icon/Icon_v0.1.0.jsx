import Icons from "../../../../libs/icons/Icons_v0.1.0"

export default function Icon_v0_1_0(props) {
  const Icon = props.iconName && Icons(props.iconName)
  return Icon ? <Icon {...props} sx={props.sx?.length && { ...props.sx[0] }} /> : <></>
}