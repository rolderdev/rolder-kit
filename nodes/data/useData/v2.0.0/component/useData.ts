import type { JsComponent, NoodlNode } from '@shared/node-v1.0.0'
import { sendSignal } from '@shared/port-send-v1.0.0'
import type { Props } from '../node/definition'
import { fetch } from './fetch'
import { unsubscribe } from './handleSubscribe'

const reactive = async (p: Props, noodlNode: NoodlNode) => {
	const { compare } = R.libs.just

	// Обработаем измения инпутов
	if (p.store.apiVersion !== p.apiVersion) {
		p.store.apiVersion = p.apiVersion
		if (!p.controlled) await fetch(p, noodlNode)
	}
	// Загрузим данные при включении реактивного режима в редакторе.
	if (p.store.controlled !== p.controlled) {
		if (p.store.controlled && !p.controlled) await fetch(p, noodlNode)
		p.store.controlled = p.controlled
	}
	// Сравним схему.
	if (!compare(p.store.fetchScheme, p.fetchScheme)) {
		p.store.fetchScheme = p.fetchScheme
		if (!p.controlled) await fetch(p, noodlNode)
	}
	// Отреагируем на включение/отключение подписки.
	if (p.store.subscribe !== p.subscribe) {
		await fetch(p, noodlNode) // Нужно перезагрузить данные, т.к. подписки прилетают с сервреа.
		p.store.subscribe = p.subscribe
		if (!p.subscribe) unsubscribe(p)
	}

	// Первый проход.
	if (!p.store.inited) {
		// Первичная загрузка реактивного режима.
		if (!p.controlled) await fetch(p, noodlNode)

		// Тригеры.
		const rootNode = R.nodes[p.store.rootId]
		if (rootNode) {
			// Смена состояний.
			Noodl.Events.on(`${rootNode.path}_singleSelectionChanged`, () => sendSignal(noodlNode, 'singleSelectionChanged'))
			Noodl.Events.on(`${rootNode.path}_multiSelectionChanged`, () => sendSignal(noodlNode, 'multiSelectionChanged'))
			Noodl.Events.on(`${rootNode.path}_expansionChanged`, () => sendSignal(noodlNode, 'expansionChanged'))
		}

		p.store.inited = true
	}

	return
}

export default {
	reactive,
	fetch: async (p: Props, noodlNode) => fetch(p, noodlNode),
	resetSingleSelection: (p: Props, noodlNode) => {
		for (const i of Object.values(R.nodes).filter((i) => i.rootId === p.store.rootId)) i.states.singleSelection.value = null

		sendSignal(noodlNode, 'singleSelectionChanged')
		if (!p.controlled) reactive(p, noodlNode)
	},
	resetMultiSelection: (p: Props, noodlNode) => {
		for (const i of Object.values(R.nodes).filter((i) => i.rootId === p.store.rootId))
			i.states.multiSelection.value = 'notSelected'

		sendSignal(noodlNode, 'multiSelectionChanged')
		if (!p.controlled) reactive(p, noodlNode)
	},
	expandAll: (p: Props, noodlNode) => {
		for (const i of Object.values(R.nodes).filter((i) => i.rootId === p.store.rootId)) i.states.expansion.value = true

		sendSignal(noodlNode, 'expansionChanged')
		if (!p.controlled) reactive(p, noodlNode)
	},
	collapseAll: (p: Props, noodlNode) => {
		for (const i of Object.values(R.nodes).filter((i) => i.rootId === p.store.rootId)) i.states.expansion.value = false

		sendSignal(noodlNode, 'expansionChanged')
		if (!p.controlled) reactive(p, noodlNode)
	},
} as JsComponent
