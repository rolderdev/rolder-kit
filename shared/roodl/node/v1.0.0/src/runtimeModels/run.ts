// Запускает реактивную JS-функцию, JS-функцию сигнал или React-сигнал.

import type { ResultPortDef } from '@shared/port-v1.0.0'
import type { JsNodeDef, NoodlNode, ReactNodeDef } from '../../main'

export const runReactiveJsFunc = async (noodlNode: NoodlNode, nodeDef: JsNodeDef, inputDef: ResultPortDef) => {
	if (nodeDef.afterNode?.triggerOnInputs) {
		if (nodeDef.afterNode.triggerOnInputs(noodlNode.props).includes(inputDef.name)) await runJsFunc(nodeDef, noodlNode)
		else if (noodlNode.firstRun) await runJsFunc(nodeDef, noodlNode)
	}
}

export const runSignal = async (noodlNode: NoodlNode, nodeDef: JsNodeDef | ReactNodeDef, inputDef: ResultPortDef) => {
	// Нужно пропустить, пока scheduleRun не отработал первый раз.
	if (!noodlNode.firstRun) {
		// Отличим JS от React по наличию reactKey у ноды.
		if (!noodlNode.reactKey) await runJsFunc(nodeDef as JsNodeDef, noodlNode, inputDef.name)
		else noodlNode.innerReactComponentRef?.[inputDef.name](noodlNode.props)
	}
}

// Нет имени сигнала, берем реактивную функцию. Иначе берем по имени сигнала.
export const runJsFunc = async (nodeDef: JsNodeDef, noodlNode: NoodlNode, signalName?: string) => {
	const module = getModule(nodeDef)
	const type: string = R.libs.just.typeOf(module)

	if (type === 'promise') {
		const m = await module
		if (signalName) await m.default[signalName]?.(noodlNode.props, noodlNode)
		else await m.default.reactive?.(noodlNode.props, noodlNode)
	}

	if (type === 'object')
		signalName ? await module[signalName]?.(noodlNode.props, noodlNode) : await module.reactive?.(noodlNode.props, noodlNode)
}

// Функция для проверки корректности импорта.
export const getModule = (nodeDef: JsNodeDef | ReactNodeDef) => {
	try {
		const module = nodeDef.module.dynamic || nodeDef.module.static
		if (!module) {
			log.error('getModule error: no module found', { nodeDef })
			return null
		}
		return module
	} catch (e) {
		log.error('Error at getModule', e)
		return null
	}
}
