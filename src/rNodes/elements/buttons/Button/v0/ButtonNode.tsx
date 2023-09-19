import { useImperativeHandle, useRef } from 'react'
import { getGroupedPorts, getPorts } from '../../../../../main/ports/v0.3.0/get';
import { useForceUpdate } from '@mantine/hooks';
import { getReactNode } from '../../../../../main/getNodes/v0.5.0/getNode';
import { CompVersions } from '../../../../../main/getNodes/v0.5.0/types';

import v0_2_0 from './v0.2.0/Button';

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts({ type: 'input', groupNames: ['Icon', 'Margins'], }),
            ...getPorts({ type: 'input', portNames: ['disabled', 'size', 'radius', 'color', 'loading', 'buttonVariant', 'label', 'buttonType'] })
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['clicked'] })],
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
const nodeName = 'Button'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })