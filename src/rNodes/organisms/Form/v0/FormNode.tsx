import { getReactNode } from "../../../../main/getNodes/v0.2.0/getNode"
import { useImperativeHandle, useRef, useState } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import { getPorts } from '../../../../main/ports/v0.2.0/ports';
import checkRequiredInputs from '../../../../utils/noodl/v0.1.0/checkRequiredInputs';
import setCompDef from '../../../../utils/noodl/v0.1.0/setCompDef';

import v0_2_0 from './v0.2.0/Form';

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [...getPorts({ type: 'input', portsNames: ['formScheme'], requiredInputs: ['formScheme'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['formHookAtForm', 'submited'] })],
    }
}

function Comps(props: any, ref: any) {
    const localRef = useRef<any>(null)
    const [compDef, setCompDefState] = useState({ props, Comp: compVersions[props.version]?.Comp });
    const compReady = checkRequiredInputs({ compDef, compVersions, version: props.version })
    useShallowEffect(() => {
        if (compReady) compDef.props.noodlNode.clearWarnings()
    }, [compReady])

    useImperativeHandle(ref, () => ({
        setCompDef(localProps: any, recreate: boolean) { setCompDefState(setCompDef({ compDef, localProps, props, recreate, compVersions })) },
        // custom
    }))

    return compReady ? <compDef.Comp {...compDef.props} ref={localRef} /> : <></>
}

export { Comps, compVersions }

///////////////////////////////////////////////////////////////////////
const nodeName = 'Form'
const nodeVersion = 'v0'

export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })