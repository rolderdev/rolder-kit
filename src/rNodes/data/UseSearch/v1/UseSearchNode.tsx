import { useImperativeHandle, useRef } from 'react'
import { getReactNode } from "../../../../main/getNodes/v0.3.0/getNode"
import { useShallowEffect } from '@mantine/hooks';
import { getPorts } from '../../../../main/ports/v0.2.0/ports';
import useComp from '../../../../utils/noodl/useComp/v0.2.0/useComp';

import v1_0_0 from './v1.0.0/UseSearch';

const compVersions: CompVersions = {
    'v1.0.0': {
        Comp: v1_0_0,
        inputs: [
            ...getPorts({
                type: 'input',
                portsNames: ['dbClasses', 'searchFields', 'searchString', 'options'],
                requiredInputs: ['dbClasses', 'searchFields']
            })
        ],
        outputs: [
            ...getPorts(({
                type: 'output',
                portsNames: ['foundedData', 'searching', 'completed']
            }))
        ]
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

const nodeName = 'UseSearch'
const nodeVersion = 'v1'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })