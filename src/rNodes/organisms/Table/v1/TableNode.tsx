import { getReactNode } from "../../../../main/getNodes/v0.3.0/getNode"
import { useImperativeHandle, useRef } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import { getPorts, getGroupedPorts } from '../../../../main/ports/v0.2.0/ports';
import useComp from "../../../../utils/noodl/useComp/v0.2.0/useComp";

import v1_0_1 from './v1.0.1/Table';
import v1_0_2 from './v1.0.2/Table';

const compVersions: CompVersions = {
    'v1.0.1': {
        Comp: v1_0_1,
        inputs: [
            ...getGroupedPorts({
                type: 'input',
                groupsNames: ['Table params', 'Table layout', 'Table style', 'Rows style'],
                requiredInputs: ['columns'],
            }),
            ...getPorts({
                type: 'input',
                portsNames: ['items', 'loading', 'searching']
            })
        ],
        outputs: [...getPorts({ type: 'output', portsNames: ['singleSelected', 'selectedItem', 'selectedItems', 'actionName'] })],
        signals: getPorts({
            type: 'input',
            portsNames: ['expandAll', 'unExpandAll']
        }),
    },
    'v1.0.2': {
        Comp: v1_0_2,
        inputs: [
            ...getGroupedPorts({
                type: 'input',
                groupsNames: ['Table params', 'Table layout', 'Table style', 'Rows style'],
                requiredInputs: ['columns'],
            }),
            ...getPorts({
                type: 'input',
                portsNames: ['items', 'loading', 'searching']
            })
        ],
        outputs: [...getPorts({ type: 'output', portsNames: ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem'], })],
        signals: getPorts({
            type: 'input',
            portsNames: ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetMultipleSelected']
        }),
    }
}

function Comps(compProps: any, ref: any) {
    const localRef = useRef<any>(null)
    const { compReady, Comp, resultProps, checksHandler } = useComp({ compProps, compVersions })

    // on load comp
    useShallowEffect(() => checksHandler(compProps), [])
    useImperativeHandle(ref, () => ({
        // on Noodl props change
        setComp(nodeProps: any) { checksHandler({ ...compProps, ...nodeProps }) },
        // custom
        expandAll() { localRef.current?.expandAll() },
        unExpandAll() { localRef.current?.unExpandAll() },
        resetSingleSelected() { localRef.current?.resetSingleSelected() },
        resetMultipleSelected() { localRef.current?.resetMultipleSelected() }
    }))
    return compReady ? <Comp {...resultProps} ref={localRef} /> : <></>
}

////////////////////////////////////////
const nodeName = 'Table'
const nodeVersion = 'v1'

export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })