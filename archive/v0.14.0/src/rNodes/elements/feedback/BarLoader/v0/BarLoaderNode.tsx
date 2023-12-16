import { useImperativeHandle, useRef } from 'react'
import { useForceUpdate } from '@mantine/hooks';
import { getPorts } from '../../../../../main/ports/v0.3.0/get';
import { CompVersions } from '../../../../../main/getNodes/v0.5.0/types';
import { getReactNode } from '../../../../../main/getNodes/v0.5.0/getNode';

import v0_1_0 from './v0.1.0/BarLoader'

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [...getPorts({ type: 'input', portNames: ['loading', 'loaderColor', 'w'] })],
    }
}

function CompsHandler(props: any, ref: any) {
    const localRef = useRef<any>(null)
    const { resultInputs, _inputValues } = props.node

    const forceUpdate = useForceUpdate()
    const Comp = compVersions[props.node._inputValues.version]?.Comp
    useImperativeHandle(ref, () => ({
        forceUpdate() { forceUpdate() },
        // custom        
    }))

    return props.node.compReady && Comp
        ? <Comp node={props.node} {...resultInputs} mounted={_inputValues.mounted} children={props.children} ref={localRef} />
        : <></>
}

////////////////////////////
const nodeName = 'BarLoader'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })