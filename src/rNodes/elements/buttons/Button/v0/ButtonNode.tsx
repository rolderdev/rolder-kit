import { getReactNode } from "../../../../../main/getNodes/v0.2.0/getNode"
import { useImperativeHandle, useRef, useState } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import checkRequiredInputs from '../../../../../utils/noodl/v0.1.0/checkRequiredInputs';
import setCompDef from '../../../../../utils/noodl/v0.1.0/setCompDef';
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

////////////////////////////////////////
const nodeName = 'Button'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })