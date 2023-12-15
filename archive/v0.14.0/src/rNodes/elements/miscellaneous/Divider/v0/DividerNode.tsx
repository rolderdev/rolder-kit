import { useImperativeHandle, useRef, useState } from 'react'
import { getReactNode } from "../../../../../main/getNodes/v0.2.0/getNode"
import { useShallowEffect } from '@mantine/hooks';
import { getGroupedPorts, getPorts } from '../../../../../main/ports/v0.2.0/ports';
import checkRequiredInputs from '../../../../../utils/noodl/v0.1.0/checkRequiredInputs';
import setCompDef from '../../../../../utils/noodl/v0.1.0/setCompDef';

import v0_1_0 from './v0.1.0/Divider';

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getGroupedPorts({
                type: 'input',
                groupsNames: ['Margins']
            }),
            ...getPorts({
                type: 'input',
                portsNames: ['dividerVariant', 'label', 'dividerLabelPosition', 'size', 'dividerOrientation']
            })
        ],
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

const nodeName = 'Divider'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })