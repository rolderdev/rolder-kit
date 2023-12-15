import { useImperativeHandle, useRef } from 'react'
import { getGroupedPorts, getPorts } from '../../../../../main/ports/v0.3.0/get';
import { CompVersions } from '../../../../../main/getNodes/v0.5.0/types';
import { getReactNode } from '../../../../../main/getNodes/v0.5.0/getNode';
import { useForceUpdate } from '@mantine/hooks';
import { useFormContextWitchCheck } from '../../../../../libs/contenxt/form/v0.1.0/useForm';

import v0_3_0 from './v0.3.0/TextInput';
import v0_4_0 from './v0.4.0/TextInput';

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts({ type: 'input', groupNames: ['Icon'], }),
            ...getPorts({
                type: 'input',
                portNames: ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'h', 'debounced', 'delay'],
                requiredInputs: ['formField']
            })
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['typedValue'] })],
    },
    'v0.4.0': {
        Comp: v0_4_0,
        inputs: [
            ...getGroupedPorts({ type: 'input', groupNames: ['Icon'], }),
            ...getPorts({
                type: 'input',
                portNames: ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'h',
                    'debouncedTyping', 'typingDelay', 'validationType', 'debouncedValidation', 'validationDelay',],
                requiredInputs: ['formField']
            })
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['typedValue'] })],
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
        checkFormContext(callBack: any) { callBack(hasFormContext) },
        // custom
    }))

    return props.node.compReady && Comp
        ? <Comp node={props.node} {...resultInputs} mounted={_inputValues.mounted} children={props.children} ref={localRef} />
        : <></>
}

////////////////////////////
const nodeName = 'TextInput'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })