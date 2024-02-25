import { ActionIcon, Group, Switch } from "@mantine/core"
import { IconRestore } from "@tabler/icons-react"
import { useState } from "react"
import { ChangeEventHandler } from "react"

type Props = {
    label: string
    default: boolean
    onChange: ChangeEventHandler<HTMLInputElement>
}

export default function (props: Props) {
    const [checked, setChecked] = useState(props.default)

    return <Group noWrap>
        <Switch
            w='100%'
            label={props.label}
            checked={checked}
            onChange={(e) => {
                props.onChange(e)
                setChecked(e.target.checked)
            }}
        />
        <ActionIcon onClick={() => {
            //@ts-ignore
            props.onChange({ target: { checked: props.default } })
            setChecked(props.default)
        }}>
            <IconRestore size={20} />
        </ActionIcon>
    </Group>
}