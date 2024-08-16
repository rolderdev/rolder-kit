/* Планировщики. Запускаются после того, как все инпуты обновились. */

import type { PortDef } from '@shared/port-v1.0.0';
import type { JsDefinition, NoodlNode } from '../../types';
import { validateValues } from './value';
import { hasWarings } from './warning';
import { runModule } from './module';

export const schedule = async (noodlNode: NoodlNode, nodeDef: JsDefinition, inputDef: PortDef, isSignal: boolean) => {
	// Пропустим, если уже запланировано.
	if (!noodlNode.scheduledRun) {
		// Запустим функцию инициализации один раз.
		if ((noodlNode.model.firstRun || noodlNode.firstRun) && nodeDef.initialize)
			noodlNode.propsCache = await nodeDef.initialize(noodlNode.propsCache);
		noodlNode.scheduledRun = true; // Запретим повторные запуски обработки портов.
		noodlNode.scheduleAfterInputsHaveUpdated(async () => {
			// Не проверяем, когда уже есть ошибки.
			if (!hasWarings(noodlNode)) validateValues(noodlNode);
			noodlNode.scheduledRun = false; // Вернем возможность запуска обработки портов.
			// Не запускаем модуль, когда есть ошибки или модуль уже запущен.
			if (!hasWarings(noodlNode) && !noodlNode.scheduledModuleRun) {
				noodlNode.scheduledModuleRun = true; // Запретим повторные запуски модуля.
				await runModule(noodlNode, nodeDef, inputDef, isSignal);
				noodlNode.scheduledModuleRun = false; // Вернем возможность запуска модуля.
			}
		});
	}
};
