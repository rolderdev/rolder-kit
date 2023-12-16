import { useImperativeHandle, useRef, useState } from 'react'
import { getPorts } from '../../../../../main/ports/v0.2.0/ports';
import Checkbox_v0_1_0 from './v0.1.0/Checkbox'

const compVersions: CompVersions = {
  'v0.1.0': {
    Comp: Checkbox_v0_1_0,
    inputs: getPorts({
      type: 'input',
      portsNames: ['color', 'label', 'labelPosition', 'description', 'error', 'radius', 'size'],
    }),
    outputs: getPorts({
      type: 'output',
      portsNames: ['checked'],
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