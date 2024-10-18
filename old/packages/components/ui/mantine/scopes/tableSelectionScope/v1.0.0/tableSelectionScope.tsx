import { sendOutput, sendSignal } from '@packages/port-send'
import { tableHandlerAtom, tableSelectionScopeAtom } from '@packages/scope'
import { Provider as JotaiProvider, useAtom } from 'jotai'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const HandlerTableSelectionScope = forwardRef((props: Props, ref) => {
	// Хука дял получения и перезаписывания атома
	const [tableSelectionScopeValue, setTableSelectionScopeValue] = useAtom(tableSelectionScopeAtom)
	const [tableHandlerAtomValue] = useAtom(tableHandlerAtom)

	useEffect(() => {
		sendOutput(props.noodlNode, 'selectionByTableId', tableSelectionScopeValue['selectionByTableId'])
		sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
		sendSignal(props.noodlNode, 'changed')
	}, [tableHandlerAtomValue, tableSelectionScopeValue])

	// При внешнем триггере reset очищаем молекулу
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				setTableSelectionScopeValue({
					tableSelectionScope: {},
					parentTableIdByTableId: {},
					tableParentItemByTableId: {},
					tableIndeterminatedItemsIdList: [],
					allTableIdList: [],
					forRenderTableId: {
						parentTableId: undefined,
						currentTableId: undefined,
						newTableId: undefined,
						childTableId: [],
					},
					selectionByTableId: {},
				})
			},
		}),
		[]
	)

	return <>{props.children}</>
})

// Что за forwardRef и как он работатет
export default forwardRef((props: Props, ref) => {
	// При внешнем триггере reset очищаем молекулу
	const localRef = useRef<any>(null)
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				localRef.current?.reset()
			},
		}),
		[]
	)

	return (
		<JotaiProvider>
			<HandlerTableSelectionScope ref={localRef} {...props} />
		</JotaiProvider>
	)
})
