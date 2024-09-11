/* Планировщики. Запускаются после того, как все инпуты обновились. */

import type { PortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, NoodlNode, ReactNodeDef } from '../../main';
import { runReactiveJsFunc } from './run';
import { setPropDeafaults } from './prop';

export default async (noodlNode: NoodlNode, nodeDef: JsNodeDef | ReactNodeDef, inputDef: PortDef) => {
	// Пропустим, если уже запланировано.
	if (!noodlNode.scheduledRun) {
		//if (noodlNode.model.type === 'rolder-kit.api-v1.useData') console.log('scheduledRun', inputDef.name);
		noodlNode.scheduledRun = true; // Запретим повторные запуски обработки портов.
		noodlNode.scheduleAfterInputsHaveUpdated(async () => {
			// Установим дефолты в props для коректной работы в runtime.
			setPropDeafaults(noodlNode, nodeDef);

			// Запустим функцию инициализации один раз.
			if (nodeDef.initialize && noodlNode.firstRun) await nodeDef.initialize(noodlNode.props, noodlNode);

			// Отличим JS от React по наличию reactKey у ноды.
			if (!noodlNode.reactKey) await runReactiveJsFunc(noodlNode, nodeDef as JsNodeDef, inputDef);
			else noodlNode.forceUpdate();

			noodlNode.firstRun = false;
			noodlNode.scheduledRun = false; // Вернем возможность запуска обработки портов.
		});
	}
};
