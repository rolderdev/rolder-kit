import { useImperativeHandle, useRef } from 'react'
import { useForceUpdate } from '@mantine/hooks';
import { getPorts } from '../../../../main/ports/v0.3.0/get';
import { getReactNode } from '../../../../main/getNodes/v0.5.0/getNode';
import { CompVersions } from '../../../../main/getNodes/v0.5.0/types';

import v0_2_0 from './v0.2.0/Form';
import v0_3_0 from './v0.3.0/Form';
import { useFormContextWitchCheck } from '../../../../libs/contenxt/form/v0.1.0/useForm';

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [...getPorts({ type: 'input', portNames: ['formScheme'], requiredInputs: ['formScheme'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['formHookAtForm', 'submited'] })],
    },
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [...getPorts({ type: 'input', portNames: ['formScheme'], requiredInputs: ['formScheme'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['formHookAtForm', 'submited'] })],
    }
}

function CompsHandler(props: any, ref: any) {
    const localRef = useRef<any>(null)
    const { resultInputs, _inputValues } = props.node
    const hasFormContext = useFormContextWitchCheck() ? true : false

    const forceUpdate = useForceUpdate()
    const Comp = compVersions[props.node._inputValues.version]?.Comp
    useImperativeHandle(ref, () => ({
        forceUpdate() { forceUpdate() },
        checkFormContext(callBack: any) { if (props.node._inputValues.version !== 'v0.2.0') callBack(hasFormContext) },
        // custom
    }))

    return props.node.compReady && Comp
        ? <Comp node={props.node} {...resultInputs} mounted={_inputValues.mounted} children={props.children} ref={localRef} />
        : <></>
}

////////////////////////////
const nodeName = 'Form'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })