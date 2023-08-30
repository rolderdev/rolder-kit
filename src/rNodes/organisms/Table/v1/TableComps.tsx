import { useImperativeHandle, useRef, useState } from 'react'
import { getPorts, getGroupedPorts } from '../../../../main/ports/v0.2.0/ports';

import Table_v1_0_0 from './v1.0.0/Table';

const compVersions: CompVersions = {
  'v1.0.0': {
    Comp: Table_v1_0_0,
    inputs: [
      ...getGroupedPorts({
        type: 'input',
        groupsNames: ['Table params', 'Table layout', 'Table style', 'Rows style']
      }),
      ...getPorts({
        type: 'input',
        portsNames: ['items', 'loading', 'searching'],
        requiredInputs: ['columns'],
      })
    ],
    outputs: [...getPorts({ type: 'output', portsNames: ['singleSelected', 'selectedItem', 'selectedItems', 'actionName'], })],
    signals: getPorts({
      type: 'input',
      portsNames: ['expandAll', 'unExpandAll']
    }),
  }
}

function Comps(props: any, ref: any) {
  const localRef = useRef<any>(null)
  const [compDef, setCompDef] = useState({ props, Comp: compVersions[props.version]?.Comp });

  useImperativeHandle(ref, () => ({
    // required signals
    setCompDef(localProps: any, recreate: boolean) {
      if (recreate) setCompDef({
        props: { style: props.style, styles: props.styles, children: props.children, ...localProps },
        Comp: compVersions[localProps.version]?.Comp
      })
      else setCompDef({
        props: { ...compDef.props, ...localProps },
        Comp: compDef.Comp
      })
    },
    // custom signals redirections
    expandAll() { localRef.current?.expandAll() },
    unExpandAll() { localRef.current?.unExpandAll() }
  }))

  return compDef.Comp ? <compDef.Comp {...compDef.props} ref={localRef} /> : <></>
}

export { Comps, compVersions }