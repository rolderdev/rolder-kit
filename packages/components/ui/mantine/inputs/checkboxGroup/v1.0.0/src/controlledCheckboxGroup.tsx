import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Box, Checkbox, Group, Stack, Text } from "@mantine/core"
import type { Props } from "../types"
import { sendOutput, sendSignal } from '@packages/port-send'
import convertForSelectInputs from '@packages/convert-for-select-inputs'
import getValue from "@packages/get-value"

export default forwardRef(function (props: Props, ref) {
    const { noodlNode, inputItems, labelField } = props

    const [data, setData] = useState<any>([])
    useEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some((i: any) => getValue(i, labelField))) {
            const convertedItems = inputItems.map(i => convertForSelectInputs(i, labelField))
            setData(convertedItems.filter(i => i && i.label && i.value))
        }
    }, [inputItems, labelField])

    const [value, setValue] = useState<string[]>([]);
    useEffect(() => {
        if (props.defaultItems) {
            const value = props.defaultItems.map((i: any) => i.value || i.label || i.id)
            setValue(value)
        }
    }, [props.defaultItems])

    useImperativeHandle(ref, () => ({ resetSelected() { setValue([]) } }), [])

    return <Checkbox.Group
        value={value}
        onChange={(v) => {
            setValue(v)
            const selectedItem = inputItems?.find((i: any) => v && [i.value, i.id, i.label].includes(v))
            sendOutput(noodlNode, 'selectedItem', selectedItem)
            sendSignal(noodlNode, 'selected')
        }}
        {...props}
        {...props.customProps}
    >
        {props.orientation === 'horizontal'
            ? <Group grow={props.grow} mr='-1rem' mb='1rem' mt={props.withAsterisk ? 8 : 0}>
                {data.map((i: any, idx: number) => <Box key={idx}>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Group>
            : <Stack >
                {data.map((i: any, idx: number) => <Box key={idx}>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Stack>
        }
    </Checkbox.Group>
})
