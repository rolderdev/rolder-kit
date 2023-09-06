import { getReactNode } from "../../../../../main/getNodes/v0.3.0/getNode"
import { useImperativeHandle, useRef } from 'react'
import { getPorts, getGroupedPorts } from '../../../../../main/ports/v0.2.0/ports';
import useComp from "../../../../../utils/noodl/useComp/v0.2.0/useComp";
import { useShallowEffect } from "@mantine/hooks";
import { useFormContextWitchCheck } from "../../../../organisms/Form/v0/v0.2.0/useForm";

import v0_3_0 from './v0.3.0/TextInput';

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts({
                type: 'input',
                groupsNames: ['Icon'],
            }),
            ...getPorts({
                type: 'input',
                portsNames: ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'h', 'debounced', 'delay'],
                requiredInputs: ['formField']
            })
        ],
        outputs: [...getPorts({ type: 'output', portsNames: ['typedValue'] })],
    }
}

function Comps(compProps: any, ref: any) {
    const localRef = useRef<any>(null)
    const { compReady, Comp, resultProps, checksHandler } = useComp({ compProps, compVersions })
    const hasFormContext = useFormContextWitchCheck() ? true : false

    // on load comp
    useShallowEffect(() => checksHandler(compProps, hasFormContext), [])
    useImperativeHandle(ref, () => ({
        // on Noodl props change
        setComp(nodeProps: any) { checksHandler({ ...compProps, ...nodeProps }, hasFormContext) },
        // custom
    }))
    return compReady ? <Comp {...resultProps} ref={localRef} /> : <></>
}

/////////////////////////////////////////////////
const nodeName = 'TextInput'
const nodeVersion = 'v0'

export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })