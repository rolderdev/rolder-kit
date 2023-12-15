import { getReactNode } from "../../../../../main/getNodes/v0.3.0/getNode"
import { useImperativeHandle, useRef } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import useComp from "../../../../../utils/noodl/useComp/v0.2.0/useComp";
import { getGroupedPorts, getPorts } from '../../../../../main/ports/v0.2.0/ports';

import v0_1_0 from './v0.1.0/PopoverButton';

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getGroupedPorts({ type: 'input', groupsNames: ['Icon'], }),
            ...getPorts({
                type: 'input', portsNames: [
                    'disabled', 'size', 'radius', 'color', 'loading', 'buttonVariant', 'label', 'withArrow', 'shadow', 'popoverPosition'
                ]
            })
        ],
        signals: getPorts({
            type: 'input',
            portsNames: ['close']
        }),
    },
}

function Comps(compProps: any, ref: any) {
    const localRef = useRef<any>(null)
    const { compReady, Comp, resultProps, checksHandler } = useComp({ compProps, compVersions })

    // on load comp
    useShallowEffect(() => checksHandler(compProps), [])
    useImperativeHandle(ref, () => ({
        // on Noodl props change
        setComp(nodeProps: any) { checksHandler({ ...compProps, ...nodeProps }) },
        // custom
        close() { localRef.current?.close() },
    }))
    return compReady ? <Comp {...resultProps} ref={localRef} /> : <></>
}

////////////////////////////////////////
const nodeName = 'PopoverButton'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })