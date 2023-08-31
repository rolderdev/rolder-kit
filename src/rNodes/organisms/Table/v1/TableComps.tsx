import { useImperativeHandle, useRef, useState } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import { NodeInstance } from '@noodl/noodl-sdk';
import { getPorts, getGroupedPorts } from '../../../../main/ports/v0.2.0/ports';

import Table_v1_0_1 from './v1.0.1/Table';

const compVersions: CompVersions = {
  'v1.0.1': {
    Comp: Table_v1_0_1,
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
  const [compReady, setCompReady] = useState(false)

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

  useShallowEffect(() => {
    if (compDef.Comp) {
      let notReadyCount = 0
      const noodlNode: NodeInstance = compDef.props.noodlNode
      Object.keys(compDef.props).forEach(propName => {
        const input = compVersions[props.version]?.inputs?.find(i => i.name === propName)
        if (input?.required) {
          const value = compDef.props[propName]
          let notReady = false
          if (Array.isArray(value) && !value?.length) notReady = true
          else if (!value) notReady = true
          if (notReady) {
            notReadyCount++
            noodlNode.sendWarning(propName, `Specify required input: "${input.displayName}"`)
          }
        }
      })
      if (notReadyCount === 0) setCompReady(true)
      else noodlNode.clearWarnings()
    }
  }, [compDef.props])

  return compReady ? <compDef.Comp {...compDef.props} ref={localRef} /> : <></>
}

export { Comps, compVersions }