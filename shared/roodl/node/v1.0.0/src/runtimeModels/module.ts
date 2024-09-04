// Планирует и запускает реактивную функцию или функцию сигнала.

import type { PortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, NoodlNode } from '../../main';

/* Разведем реакцию на сигнал и на изменение инпута. scheduleAfterInputsHaveUpdated - откладываем реакцию на момент,
когда все порты обновились, но для каждого запуска, поэтому нужен флаг.
Тригерим если не сигнал и разработчик указал, что этот порт реактивный.
Если сигнал, просто тригерим. Сигнал - простой тогл true/false. Т.е. меняется два раза, запускаем на true. */
export const runModule = async (noodlNode: NoodlNode, nodeDef: JsNodeDef, inputDef: PortDef, isSignal: boolean) => {
	if (!isSignal) {
		if (nodeDef.triggerOnInputs) {
			if (nodeDef.triggerOnInputs(noodlNode.props).includes(inputDef.name)) await runModuleFunc(nodeDef, noodlNode);
			else if (noodlNode.firstRun) await runModuleFunc(nodeDef, noodlNode);
		}
	} else await runModuleFunc(nodeDef, noodlNode, inputDef.name);
	noodlNode.scheduledModuleRun = false; // Вернем возможность запуска модуля.
};

// Нет имени сигнала, берем реактивную функцию. Иначе берем по имени сигнала.
const runModuleFunc = async (nodeDef: JsNodeDef, noodlNode: NoodlNode, signalName?: string) => {
	const module = getModule(nodeDef);
	const type: string = R.libs.just.typeOf(module);

	if (type === 'promise') {
		const m = await module;
		if (signalName) await m.default[signalName]?.(noodlNode.props, noodlNode);
		else await m.default.reactive?.(noodlNode.props, noodlNode);
	}

	if (type === 'object')
		signalName ? await module[signalName]?.(noodlNode.props, noodlNode) : await module.reactive?.(noodlNode.props, noodlNode);
};

// Функция для проверки корректности импорта.
export const getModule = (nodeDef: JsNodeDef) => {
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
