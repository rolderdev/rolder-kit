import { useImperativeHandle, useRef, useState } from 'react'
import { useShallowEffect } from '@mantine/hooks';
import { NodeInstance } from '@noodl/noodl-sdk';
import { getPorts } from '../../../../main/ports/v0.2.0/ports';

import Form_v0_2_0 from './v0.2.0/Form';

const compVersions: CompVersions = {
  'v0.2.0': {
    Comp: Form_v0_2_0,
    inputs: [...getPorts({ type: 'input', portsNames: ['formScheme'], requiredInputs: ['formScheme'] })],
    outputs: [...getPorts({ type: 'output', portsNames: ['formHook', 'submited'] })],
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
    }
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