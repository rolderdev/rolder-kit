import { useImperativeHandle, useRef, useState } from 'react'
import { getPorts } from '../../../../main/ports/v0.3.0/get';
import { CompVersions } from '../../../../main/getNodes/v0.5.0/types';
import { getReactNode } from '../../../../main/getNodes/v0.5.0/getNode';
import { useForceUpdate } from '@mantine/hooks';

import v1_0_0 from './v1.0.0/UseData'
import v1_1_0 from './v1.1.0/UseData'

const compVersions: CompVersions = {
    'v1.0.0': {
        Comp: v1_0_0,
        inputs: [
            ...getPorts({ type: 'input', portNames: ['queryType'], customs: { groupName: 'Query type' } }),
            ...getPorts({
                type: 'input',
                portNames: ['dbClass', 'filters', 'sorts', 'options', 'subscribe', 'getUsers'],
                requiredInputs: ['dbClass'],
                customs: { groupName: 'Query params' }
            }),
            ...getPorts({
                type: 'input',
                portNames: ['searchEnabled', 'dbClasses', 'searchFields', 'searchString', 'searchDelay'],
                customs: { groupName: 'Search params' }
            }),
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['items', 'loaded', 'loading', 'fetchedCount', 'totalCount', 'searching'] })],
        signals: [...getPorts({ type: 'input', portNames: ['runQuery', 'reload'] })]
    },
    'v1.1.0': {
        Comp: v1_1_0,
        inputs: [
            ...getPorts({ type: 'input', portNames: ['queryType'], customs: { groupName: 'Query type' } }),
            ...getPorts({
                type: 'input',
                portNames: ['dbClass', 'filters', 'sorts', 'options', 'subscribe', 'getUsers'],
                requiredInputs: ['dbClass'],
                customs: { groupName: 'Query params' }
            }),
            ...getPorts({
                type: 'input',
                portNames: ['searchEnabled', 'useReferences', 'searchFields', 'searchString', 'searchDelay'],
                customs: { groupName: 'Search params' }
            }),
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['items', 'loaded', 'loading', 'fetchedCount', 'totalCount', 'searching'] })],
        signals: [...getPorts({ type: 'input', portNames: ['runQuery'] })]
    },    
}

function CompsHandler(props: any, ref: any) {
    const localRef = useRef<any>(null)
    const { resultInputs, _inputValues } = props.node
    const [queryReady, setQueryReady] = useState(false)

    const forceUpdate = useForceUpdate()
    const Comp = compVersions[props.node._inputValues.version]?.Comp
    useImperativeHandle(ref, () => ({
        forceUpdate() { forceUpdate() },
        // custom
        runQuery() { setQueryReady(true) }
    }))

    return props.node.compReady && queryReady && Comp
        ? <Comp node={props.node} {...resultInputs} mounted={_inputValues.mounted} children={props.children} ref={localRef} />
        : <></>
}

////////////////////////////
const nodeName = 'UseData'
const nodeVersion = 'v1'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })