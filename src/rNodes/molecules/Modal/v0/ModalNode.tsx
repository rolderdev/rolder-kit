import { useImperativeHandle, useRef } from 'react'
import { getPorts } from '../../../../main/ports/v0.3.0/get';
import { CompVersions } from '../../../../main/getNodes/v0.5.0/types';
import { getReactNode } from '../../../../main/getNodes/v0.5.0/getNode';
import { useForceUpdate } from '@mantine/hooks';

import v0_2_0 from './v0.2.0/Modal'

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getPorts({
                type: 'input',
                portNames: ['modalHeaderEnabled', 'modalTitle', 'closeActionEnabled', 'sizePresets', 'sizeUnits', 'fullScreen', 'modalTitleOrder',
                    'modalOpacity', 'modalBlur']
            })
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['closed'] })],
        signals: [...getPorts({ type: 'input', portNames: ['open', 'close'] })]
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
        open() { localRef.current?.open() },
        close() { localRef.current?.close() },
    }))

    return props.node.compReady && Comp
        ? <Comp node={props.node} {...resultInputs} mounted={_inputValues.mounted} children={props.children} ref={localRef} />
        : <></>
}

////////////////////////////
const nodeName = 'Modal'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })