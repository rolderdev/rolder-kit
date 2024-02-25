import { forwardRef, useEffect, useState } from "react"
import { Box, Checkbox, Group, Stack, Text } from "@mantine/core"
import { Props } from "../types"
import convertForSelectInputs from '@shared/convert-for-select-inputs'
import getValue from "@shared/get-value"
import { useFormScope } from "@shared/scope"
import { sendOutput, sendSignal } from "@shared/port-send"
import React from "react"

export default forwardRef(function (props: Props) {
    const { noodlNode, inputItems, labelField, formField } = props
    const formHook = useFormScope()

    const [data, setData] = useState<any>([])
    useEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some((i: any) => getValue(i, labelField))) {
            const convertedItems = inputItems.map(i => convertForSelectInputs(i, labelField))
            setData(convertedItems.filter(i => i && i.label && i.value))
        }
    }, [inputItems, labelField])

    useEffect(() => {
        if (inputItems) {
            const value = formHook?.values?.[formField]
            const selectedItem = inputItems.find((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(noodlNode, 'selectedItem', selectedItem || null)
            sendSignal(noodlNode, 'selected')
        }
    }, [formHook?.values?.[formField]])

    return <Checkbox.Group
        {...props}
        {...props.customProps}
        {...formHook?.getInputProps(formField)}
    >
        {props.orientation === 'horizontal'
            ? <Group grow={props.grow} mr='-1rem' mb='1rem' mt={props.withAsterisk ? 8 : 0}>
                {data?.map((i: any, idx: number) => <Box key={idx}>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Group>
            :
            <Stack>
                {data?.map((i: any, idx: number) => <Box key={idx}>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Stack>
        }
    </Checkbox.Group>
})