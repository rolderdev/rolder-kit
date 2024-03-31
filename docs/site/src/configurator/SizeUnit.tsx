import { ActionIcon, Flex, NumberInput } from "@mantine/core"
import { useState } from "react"
import Unit from "./Unit"
import { IconRestore } from "@tabler/icons-react"
import React = require('react')

const units = [{ value: '%', label: '%' }, { value: 'rem', label: 'rem' }, { value: 'px', label: 'px' }]

type Props = {
    label: string
    defaultSize?: number | ""
    defaultUnit?: string | null
    units?: string[]
    onChange(sizeNumber: number | "", sizeUnit: string): void
}

export default function (props: Props) {
    const [sizeNumber, setSizeNumber] = useState<number | "">(props.defaultSize)
    const [sizeUnit, setSizeUnit] = useState<string | null>(props.defaultUnit)

    return <Flex columnGap='xs' align='flex-end'>
        <NumberInput
            label={props.label}
            value={sizeNumber}
            step={10}
            onChange={v => {
                setSizeNumber(v)
                props.onChange(v, sizeUnit)
            }}
        />
        <Unit        
            value={sizeUnit}
            data={props.units || units}
            onChange={v => {
                setSizeUnit(v)
                props.onChange(sizeNumber, v)
            }} />
        <ActionIcon mb={4} onClick={() => {
            setSizeNumber(props.defaultSize || '')
            setSizeUnit(props.defaultUnit || '%')
            props.onChange(props.defaultSize, props.defaultUnit)
        }}>
            <IconRestore size={20} />
        </ActionIcon>
    </Flex>
}