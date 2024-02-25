import { ActionIcon, Flex, TextInput } from "@mantine/core"
import { IconRestore } from "@tabler/icons-react"
import { useState } from "react"
import { ChangeEventHandler } from "react"

type Props = {
    label: string
    default?: string
    onChange: ChangeEventHandler<HTMLInputElement>
}

export default function (props: Props) {
    const [value, setValue] = useState(props.default || '')

    return <Flex columnGap='xs' align='flex-end'>
        <TextInput
            w='100%'
            label={props.label}
            value={value}
            onChange={(e) => {
                props.onChange(e)
                setValue(e.target.value)
            }}
        />
        <ActionIcon mb={4} onClick={() => {
            //@ts-ignore
            props.onChange({ target: { value: props.default } })
            setValue(props.default || '')
        }}>
            <IconRestore size={20} />
        </ActionIcon>
    </Flex>

}