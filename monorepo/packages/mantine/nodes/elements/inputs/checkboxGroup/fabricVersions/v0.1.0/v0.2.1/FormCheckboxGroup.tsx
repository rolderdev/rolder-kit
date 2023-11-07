import { forwardRef, useImperativeHandle, useState } from "react"
import { useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
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
    useShallowEffect(() => {
        if (props.inputItems) {
            const value = formHook?.values?.[props.formField]
            const selectedItems = props.inputItems.filter((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(props.noodlNode, 'selectedItems', selectedItems || null)
            sendSignal(props.noodlNode, 'selected')
            if (!value) sendSignal(props.noodlNode, 'reseted')
        }
    }, [formHook?.values?.[props.formField]])


    // reset
    useImperativeHandle(ref, () => ({ resetSelected() { formHook?.setFieldValue(props.formField, null) } }), [])

    return <Checkbox.Group
        {...props}
        {...props.customProps}
        {...formHook.getInputProps(props.formField)}
    >
        {props.checkboxGroupOrientation === 'horizontal'
            ?
            <Group grow={props.grow} mr='-1rem' mb='1rem' mt={props.withAsterisk ? 8 : 0}>
                {data?.map((i: any) => <Box>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Group>
            :
            <Stack spacing={props.spacing}>
                {data?.map((i: any) => <Box>
                    <Text fz={props.checkBoxFz}>{i.label}</Text>
                    <Checkbox mt={8} value={i.value} disabled={props.disabled || i.disabled} color={props.checkboxColor} />
                </Box>)}
            </Stack>
        }
    </Checkbox.Group>
})