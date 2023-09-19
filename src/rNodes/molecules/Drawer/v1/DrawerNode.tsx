import { useImperativeHandle, useRef } from 'react'
import { getPorts } from '../../../../main/ports/v0.3.0/get';
import { CompVersions } from '../../../../main/getNodes/v0.5.0/types';
import { useForceUpdate } from '@mantine/hooks';
import { getReactNode } from '../../../../main/getNodes/v0.5.0/getNode';

import v1_0_0 from './v1.0.0/Drawer'

const compVersions: CompVersions = {
    'v1.0.0': {
        Comp: v1_0_0,
        inputs: [...getPorts({
            type: 'input',
            portNames: ['drawerPosition', 'drawerTitle', 'sizePresets', 'sizeUnits', 'drawerHeaderEnabled', 'closeActionEnabled',
                'drawerOpacity', 'drawerBlur', 'drawerTitleOrder']
        })],
        outputs: [...getPorts({ type: 'output', portNames: ['closed'] })],
        signals: getPorts({ type: 'input', portNames: ['open', 'close'] }),
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
const nodeName = 'Drawer'
const nodeVersion = 'v1'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })