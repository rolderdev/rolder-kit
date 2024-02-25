import { Avatar, Badge, Group } from '@mantine/core'
import { IconAdjustments, IconFunction, IconPerspective } from '@tabler/icons-react'

const iconStyle = { marginTop: 4, marginBottom: 4, marginLeft: 4 }
const icons = {
    'Custom props': <IconAdjustments size={18} style={iconStyle} />,
    'Props function': <IconFunction size={18} style={iconStyle} />,
    Scope: <IconPerspective size={18} style={iconStyle} />,
}

const Feature = (props: any) => (
    <Badge pl={0} size="md" h={24} radius="md" leftSection={icons[props.name]}>
        {props.name == 'Scope' ? props.scopes : props.name}
    </Badge>
)

export default function (props: any) {
    return <Group>
        {props.features?.map((i, key) => <Feature key={key} scopes={props.scopes} name={i} />)}
    </Group>
}