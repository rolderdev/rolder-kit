import { useImperativeHandle, useRef } from 'react'
import { getGroupedPorts, getPorts } from '../../../../main/ports/v0.3.0/get';
import { CompVersions } from '../../../../main/getNodes/v0.5.0/types';
import { getReactNode } from '../../../../main/getNodes/v0.5.0/getNode';
import { useForceUpdate } from '@mantine/hooks';


import v1_0_1 from './v1.0.1/Table';
import v1_0_2 from './v1.0.2/Table';
import v1_1_0 from './v1.1.0/Table';

const compVersions: CompVersions = {
    'v1.0.1': {
        Comp: v1_0_1,
        inputs: [
            ...getGroupedPorts({
                type: 'input',
                groupNames: ['Table params', 'Table layout', 'Table style', 'Rows style'],
                requiredInputs: ['columns'],
            }),
            ...getPorts({
                type: 'input',
                portNames: ['items', 'loading', 'tableSearching']
            })
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['singleSelected', 'selectedItem', 'selectedItems', 'actionName'] })],
        signals: getPorts({
            type: 'input',
            portNames: ['expandAll', 'unExpandAll']
        }),
    },
    'v1.0.2': {
        Comp: v1_0_2,
        inputs: [
            ...getGroupedPorts({
                type: 'input',
                groupNames: ['Table params', 'Table layout', 'Table style', 'Rows style'],
                requiredInputs: ['columns'],
            }),
            ...getPorts({
                type: 'input',
                portNames: ['items', 'loading', 'tableSearching']
            })
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem'], })],
        signals: getPorts({
            type: 'input',
            portNames: ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetMultipleSelected']
        }),
    },
    'v1.1.0': {
        Comp: v1_1_0,
        inputs: [
            ...getGroupedPorts({
                type: 'input',
                groupNames: ['Table params', 'Table layout', 'Table style', 'Rows style'],
                requiredInputs: ['columns'],
            }),
            ...getPorts({
                type: 'input',
                portNames: ['items', 'loading', 'tableSearching']
            })
        ],
        outputs: [...getPorts({ type: 'output', portNames: ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem'], })],
        signals: getPorts({
            type: 'input',
            portNames: ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetMultipleSelected']
        }),
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
        expandAll() { localRef.current?.expandAll() },
        unExpandAll() { localRef.current?.unExpandAll() },
        resetSingleSelected() { localRef.current?.resetSingleSelected() },
        resetMultipleSelected() { localRef.current?.resetMultipleSelected() }
    }))

    return props.node.compReady && Comp
        ? <Comp node={props.node} {...resultInputs} mounted={_inputValues.mounted} children={props.children} ref={localRef} />
        : <></>
}

////////////////////////////
const nodeName = 'Table'
const nodeVersion = 'v1'
export default getReactNode({ nodeName, nodeVersion, CompsHandler, compVersions })