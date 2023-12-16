import { useImperativeHandle, useRef } from 'react'
import { useForceUpdate } from '@mantine/hooks';
import { CompVersions } from '../../../../../main/getNodes/v0.5.0/types';
import { getGroupedPorts, getPorts } from '../../../../../main/ports/v0.3.0/get';
import { getReactNode } from '../../../../../main/getNodes/v0.5.0/getNode';
import { useFormContextWitchCheck } from '../../../../../libs/contenxt/form/v0.1.0/useForm';

import v0_1_0 from './v0.1.0/MaskedInput';
import v0_2_0 from './v0.2.0/MaskedInput';

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getPorts({
                type: 'input',
                portNames: [
                    'useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'h', 'mask', 'hideMask', 'overwrite'
                ]
            }),
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['value'] })],
    },
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts({ type: 'input', groupNames: ['Icon'], }),
            ...getPorts({
                type: 'input',
                portNames: ['label', 'placeholder', 'debouncedTyping', 'typingDelay',],
                requiredInputs: ['formField'],
                customs: { groupName: 'Input params' }
            }),
            ...getPorts({
                type: 'input',
                portNames: [
                    'useForm', 'formField', 'disabled', 'radius', 'withAsterisk', 'w', 'h',
                    'validationType', 'debouncedValidation', 'validationDelay',
                    'maskType', 'maskPattern', 'hideMaskPattern', 'overwriteMaskPattern', 'thousandsSeparator', 'radix', 'numberScale'
                ],
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
const nodeName = 'MaskedInput'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })