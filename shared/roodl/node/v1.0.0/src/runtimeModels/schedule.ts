/* Планировщики. Запускаются после того, как все инпуты обновились. */

import type { PortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, NoodlNode, ReactNodeDef } from '../../main';
import { runModule } from './module';
import { setPropDeafaults } from './prop';

export const schedule = async (noodlNode: NoodlNode, nodeDef: JsNodeDef | ReactNodeDef, inputDef: PortDef, isSignal: boolean) => {
	// Пропустим, если уже запланировано.
	if (!noodlNode.scheduledRun) {
		noodlNode.scheduledRun = true; // Запретим повторные запуски обработки портов.
		noodlNode.scheduleAfterInputsHaveUpdated(async () => {
			noodlNode.scheduledRun = false; // Вернем возможность запуска обработки поров.
			setPropDeafaults(noodlNode, nodeDef); // Установим дефолты в props для коректной работы в runtime.
			// Запустим функцию инициализации один раз.
			if (nodeDef.initialize && noodlNode.firstRun) await nodeDef.initialize(noodlNode.props, noodlNode);

			// Отличим JS от React по наличию reactKey у ноды.
			if (!noodlNode.reactKey) {
				if (!noodlNode.scheduledModuleRun) {
					noodlNode.scheduledModuleRun = true; // Запретим повторные запуски модуля.
					await runModule(noodlNode, nodeDef as JsNodeDef, inputDef, isSignal);
					noodlNode.firstRun = false;
				}
			} else {
				noodlNode.firstRun = false;
				// Отличим сигнал от обновления занчения. То что, реагируем толь на true, уже разрулено в node.ts
				if (isSignal) {
					// Отсавим без проверки наличие сигнала в компоненте, чтобы ее разработчик увидел ошибку.
					noodlNode.innerReactComponentRef?.[inputDef.name](noodlNode.props);
				} else noodlNode.forceUpdate();
			}
		});
	}
};