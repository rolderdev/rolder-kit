// Планирует и запускает реактивную функцию или функцию сигнала.

import typeOf from 'just-typeof';
import type { PortDef } from '@packages/port';
import type { JsDefinition, NoodlNode, Props } from '../../types';

/* Разведем реакцию на сигнал и на изменение инпута. scheduleAfterInputsHaveUpdated - откладываем реакцию на момент,
когда все порты обновились, но для каждого запуска, поэтому нужен флаг.
Тригерим если не сигнал и разработчик указал, что этот порт реактивный.
Если сигнал, просто тригерим. Сигнал - простой тогл true/false. Т.е. меняется два раза, запускаем на true. */
export const runModule = async (noodlNode: NoodlNode, nodeDef: JsDefinition, inputDef: PortDef, isSignal: boolean) => {
	if (!isSignal) {
		if (nodeDef.triggerOnInputs?.(noodlNode.propsCache).includes(inputDef.name) || noodlNode.model.firstRun) {
			await runModuleFunc(nodeDef, noodlNode.propsCache);
			noodlNode.model.firstRun = false;
		}
	} else await runModuleFunc(nodeDef, noodlNode.propsCache, inputDef.name);
};

// Нет имени сигнала, берем реактивную функцию. Иначе берем по имени сигнала.
const runModuleFunc = async (nodeDef: JsDefinition, props: Props, signalName?: string) => {
	const module = getModule(nodeDef);
	const type: string = typeOf(module);
	if (type === 'promise') {
		const m = await module.then((m: any) => m.default);
		signalName ? await m[signalName]?.(props) : await m.reactive?.(props);
	}
	if (type === 'object') signalName ? await module[signalName]?.(props) : await module.reactive?.(props);
};

// Функция для проверки корректности импорта.
const getModule = (nodeDef: JsDefinition) => {
	try {
		const module = nodeDef.module.dynamic || nodeDef.module.static;
		if (module) return module;
		else {
			log.error(`getModule error: no module found`, { nodeDef });
			return null;
		}
	} catch (e) {
		log.error('Error at getModule', e);
		return null;
	}
};
