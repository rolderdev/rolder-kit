import { useImperativeHandle, useRef } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import { getPorts } from '../../../../main/ports/v0.3.0/get';
import { getReactNode } from '../../../../main/getNodes/v0.4.0/getNode';
import useComp from '../../../../utils/noodl/useComp/v0.3.0/useComp';

import v0_2_0 from './v0.2.0/Form';

const compVersions: CompVersions2 = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [...getPorts({ type: 'input', portsNames: ['formScheme'], requiredInputs: ['formScheme'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['formHookAtForm', 'submited'] })],
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

///////////////////////////////////////////////////////////////////////
const nodeName = 'Form'
const nodeVersion = 'v0'

export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })