import { useId } from '@mantine/hooks';
import { ScopeProvider, createScope, molecule } from 'bunshi/react';
import { deepMap } from 'nanostores';
import { forwardRef, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom';
import { sendOutput, sendSignal } from '../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send';

const DataContextScope = createScope<string>('')
export const DataContextMolecule = molecule((_, getScope) => {
  return getScope(DataContextScope)
})

export const dataNodes = deepMap<{ [contextId: string]: { [dbClass: string]: NoodlNode } }>({})
export const dataSchemes = deepMap<{ [contextId: string]: { [dbClass: string]: DataScheme12 } }>({})
export const dataCache = deepMap<{ [contextId: string]: { [dbClass: string]: RItem[] } }>({})
export const dataStates = deepMap<{ [contextId: string]: { [dbClass: string]: boolean } }>({})

export default forwardRef(function (props: any) {
  const dataContextId = useId()

  dataStates.listen((dataState) => {
    if (dataState[dataContextId]) {
      sendOutput(props.noodlNode, 'fetching', Object.values(dataState[dataContextId]).some(i => i) ? true : false)
      if (!Object.values(dataState[dataContextId]).some(i => i)) sendSignal(props.noodlNode, 'fetched')
    }
  })

  const container = useRef(document.createElement('div'))
  useEffect(() => {
    dataCache.setKey(dataContextId, {})
    document.body.appendChild(container.current)
    return () => {
      dataCache.setKey(dataContextId, {})
      dataNodes.setKey(dataContextId, {})
      dataSchemes.setKey(dataContextId, {})
      dataStates.setKey(dataContextId, {})
      document.body.removeChild(container.current)
    }
  }, [])


  return createPortal(
    <ScopeProvider scope={DataContextScope} value={dataContextId}>
      {props.children}
    </ScopeProvider>,
    container.current
  )
})