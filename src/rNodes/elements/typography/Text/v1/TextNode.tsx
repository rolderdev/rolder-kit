import { getReactNode } from "../../../../../main/getNodes/v0.3.0/getNode"
import { useImperativeHandle, useRef } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import { getGroupedPorts, getPorts } from '../../../../../main/ports/v0.2.0/ports';
import useComp from "../../../../../utils/noodl/useComp/v0.2.0/useComp";

import Text_v1_0_0 from './v1.0.0/Text';

const compVersions: CompVersions = {
    'v1.0.0': {
        Comp: Text_v1_0_0,
        inputs: [
            ...getGroupedPorts({ type: 'input', groupsNames: ['Font'] }),
            ...getPorts({ type: 'input', portsNames: ['value', 'color', 'w', 'textMask', 'masked'] })
        ],
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

const nodeName = 'Text'
const nodeVersion = 'v1'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })