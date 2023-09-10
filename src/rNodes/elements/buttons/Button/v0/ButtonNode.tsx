import { getReactNode } from "../../../../../main/getNodes/v0.3.0/getNode"
import { useImperativeHandle, useRef } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import useComp from "../../../../../utils/noodl/useComp/v0.2.0/useComp";
import { getGroupedPorts, getPorts } from '../../../../../main/ports/v0.2.0/ports';

import v0_2_0 from './v0.2.0/Button';

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts({ type: 'input', groupsNames: ['Icon', 'Margins'], }),
            ...getPorts({ type: 'input', portsNames: ['disabled', 'size', 'radius', 'color', 'loading', 'buttonVariant', 'label', 'buttonType'] })
        ],
        outputs: [...getPorts({ type: 'output', portsNames: ['clicked'] })],
    }
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
    }))
    return compReady ? <Comp {...resultProps} ref={localRef} /> : <></>
}

////////////////////////////////////////
const nodeName = 'Button'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })