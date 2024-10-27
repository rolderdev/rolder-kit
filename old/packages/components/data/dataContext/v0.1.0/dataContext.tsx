import type { NoodlNode } from '@packages/node'
import { sendOutput, sendSignal } from '@packages/port-send'
import { ScopeProvider, createScope, molecule } from 'bunshi/react'
import { deepMap } from 'nanostores'
import { forwardRef, useEffect, useRef } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'
import type { Item } from 'types'
import type { DataScheme, Props } from './types'

const DataContextScope = createScope<string>('')
export const DataContextMolecule = molecule((_, getScope) => {
	return getScope(DataContextScope)
})

export const dataNodes = deepMap<{ [contextId: string]: { [dbClass: string]: NoodlNode } }>({})
export const dataSchemes = deepMap<{ [contextId: string]: { [dbClass: string]: DataScheme } }>({})
export const dataCache = deepMap<{ [contextId: string]: { [dbClass: string]: Item[] } }>({})
export const dataStates = deepMap<{ [contextId: string]: { [dbClass: string]: boolean } }>({})

export default forwardRef((props: Props) => {
	const dataContextId = props.noodlNode.id

	dataStates.listen((dataState) => {
		if (dataState[dataContextId]) {
			sendOutput(props.noodlNode, 'fetching', Object.values(dataState[dataContextId]).some((i) => i) ? true : false)
			if (!Object.values(dataState[dataContextId]).some((i) => i)) sendSignal(props.noodlNode, 'fetched')
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
