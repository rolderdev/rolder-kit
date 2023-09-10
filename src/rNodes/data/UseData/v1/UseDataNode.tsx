import { useImperativeHandle, useRef, useState } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import useComp from '../../../../utils/noodl/useComp/v0.3.0/useComp';
import { getReactNode } from '../../../../main/getNodes/v0.4.0/getNode';
import { getPorts } from '../../../../main/ports/v0.3.0/get';

import v1_0_0 from './v1.0.0/UseData';

const compVersions: CompVersions2 = {
    'v1.0.0': {
        Comp: v1_0_0,
        inputs: [
            ...getPorts({ type: 'input', portsNames: ['queryType'], customs: { groupName: 'Query type' } }),
            ...getPorts({
                type: 'input',
                portsNames: ['dbClass', 'filters', 'sorts', 'options', 'subscribe', 'getUsers'],
                requiredInputs: ['dbClass'],
                customs: { groupName: 'Query params' }
            }),
            ...getPorts({
                type: 'input',
                portsNames: ['searchEnabled', 'dbClasses', 'searchFields', 'searchString', 'searchDelay'],
                customs: { groupName: 'Search params' }
            }),
        ],
        outputs: [...getPorts({ type: 'output', portsNames: ['items', 'loaded', 'loading', 'fetchedCount', 'totalCount', 'searching'] })],
        signals: [...getPorts({ type: 'input', portsNames: ['runQuery', 'reload'] })]
    }
}

function Comps(compProps: any, ref: any) {
    const localRef = useRef<any>(null)
    const { compReady, Comp, resultProps, checksHandler } = useComp({ compProps, compVersions })
    const [queryReady, setQueryReady] = useState(false)

    // on load comp
    useShallowEffect(() => checksHandler(compProps), [])
    useImperativeHandle(ref, () => ({
        // on Noodl props change
        setComp(nodeProps: any) { checksHandler({ ...compProps, ...nodeProps }) },
        // custom
        runQuery() { setQueryReady(true) },
        reload() { localRef.current?.reload() }
    }))
    return compReady && queryReady ? <Comp {...resultProps} ref={localRef} /> : <></>
}

const nodeName = 'UseData'
const nodeVersion = 'v1'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })