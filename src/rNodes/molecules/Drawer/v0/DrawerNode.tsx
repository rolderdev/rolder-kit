import { getReactNode } from "../../../../main/getNodes/v0.2.0/getNode"
import { useImperativeHandle, useRef, useState } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import { getPorts } from '../../../../main/ports/v0.2.0/ports';
import setCompDef from "../../../../utils/noodl/v0.1.0/setCompDef";
import checkRequiredInputs from "../../../../utils/noodl/v0.1.0/checkRequiredInputs";

import Drawer_v0_2_0 from './v0.2.0/Drawer';
import Drawer_v0_3_0 from './v0.3.0/Drawer';

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: Drawer_v0_2_0,
        inputs: [...getPorts({ type: 'input', portsNames: ['drawerPosition', 'title', 'size', 'sizeUnits', 'opacity'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['hided'] })],
        signals: getPorts({
            type: 'input',
            portsNames: ['open', 'close']
        }),
    },
    'v0.3.0': {
        Comp: Drawer_v0_3_0,
        inputs: [...getPorts({
            type: 'input',
            portsNames: [
                'drawerPosition', 'drawerTitle', 'size', 'sizeUnits', 'drawerHeaderEnabled', 'closeActionEnabled', 'opacity', 'drawerTitleOrder'
            ]
        })],
        outputs: [...getPorts({ type: 'output', portsNames: ['closed'] })],
        signals: getPorts({
            type: 'input',
            portsNames: ['open', 'close']
        }),
    },
}

function Comps(props: any, ref: any) {
    const localRef = useRef<any>(null)
    const [compDef, setCompDefState] = useState({ props, Comp: compVersions[props.version]?.Comp });
    const compReady = checkRequiredInputs({ compDef, compVersions, version: props.version })
    useShallowEffect(() => {
        if (compReady) compDef.props.noodlNode.clearWarnings()
    }, [compReady])

    useImperativeHandle(ref, () => ({
        setCompDef(localProps: any, recreate: boolean) { setCompDefState(setCompDef({ compDef, localProps, props, recreate, compVersions })) },
        // custom
        open() { localRef.current?.open() },
        close() { localRef.current?.close() },
    }))

    return compReady ? <compDef.Comp {...compDef.props} ref={localRef} /> : <></>
}

const nodeName = 'Drawer'
const nodeVersion = 'v0'
export default getReactNode({ nodeName, nodeVersion, Comps, compVersions })