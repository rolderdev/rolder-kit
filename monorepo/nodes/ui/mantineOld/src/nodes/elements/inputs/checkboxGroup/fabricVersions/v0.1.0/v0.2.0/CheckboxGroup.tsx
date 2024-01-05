import { forwardRef, useImperativeHandle, useState } from "react"
import { useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { Box, Checkbox, Group, Stack, Text } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"

export default forwardRef(function (props: any, ref) {
    const { getValue } = window.R.utils

    const [data, setData] = useState([])
    useShallowEffect(() => {
        const items = props.inputItems
        if (props.labelField && items?.some((i: any) => getValue.v7(i, props.labelField)))
            setData(items.map((i: any) => converForSelectInputs(i, props.labelField)))
    }, [props])

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)
    const [value, setValue] = useState<string[]>([]);
    useShallowEffect(() => {
        if (props.inputItems) {
            const selectedItems = props.inputItems.filter((i: any) => value.includes(i.value) || value.includes(i.id) || value.includes(i.label))
            sendOutput(props.noodlNode, 'selectedItems', selectedItems || [])
            sendSignal(props.noodlNode, 'selected')
        }
    }, [value])

    // controlled
    useShallowEffect(() => {
        if (props.defaultItems) {
            const value = props.defaultItems?.map((i: any) => i.value) ||
                props.defaultItems?.map((i: any) => i.id) ||
                props.defaultItems?.map((i: any) => i.label) || []
            formHook?.setFieldValue(props.formField, value)
            setValue(value)
        }
    }, [props.defaultItems])

    // reset
    useImperativeHandle(ref, () => ({
        resetSelected() {
            formHook?.setFieldValue(props.formField, null)
            setValue([])
        }
    }), [])

    return <Checkbox.Group
        value={props.useForm ? formHook?.values?.[props.formField] : value}
        onChange={(value) => {
            formHook?.setFieldValue(props.formField, value)
            setValue(value)
        }}
        {...props}
        {...props.customProps}
    >
        {props.checkboxGroupOrientation === 'horizontal'
            ?
            <Group grow={props.grow} mr='-1rem' mb='1rem' mt={props.withAsterisk ? 8 : 0}>
                {data?.map((i: any, idx) => <Box key={idx}>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Group>
            :
            <Stack spacing={props.spacing}>
                {data?.map((i: any, idx) => <Box key={idx}>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Stack>
        }
    </Checkbox.Group>
})