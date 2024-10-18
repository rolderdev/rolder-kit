/* Планировщики. Запускаются после того, как все инпуты обновились. */

import type { ResultPortDef } from '@shared/port-v1.0.0'
import type { JsNodeDef, JsNodeVersions, NoodlNode, ReactNodeDef, ReactNodeVersions } from '../../main'
import { getNodeInputDefs } from '../editorModels/nodePort'
import { setPropDeafaults } from './prop'
import { runReactiveJsFunc } from './run'

export default async (
	noodlNode: NoodlNode,
	nodeDef: JsNodeDef | ReactNodeDef,
	inputDef: ResultPortDef,
	versions: JsNodeVersions | ReactNodeVersions
) => {
	// Пропустим, если уже запланировано.
	if (!noodlNode.scheduledRun) {
		noodlNode.scheduledRun = true // Запретим повторные запуски обработки портов.
		noodlNode.scheduleAfterInputsHaveUpdated(async () => {
			// Установим дефолты в props для коректной работы в runtime.
			setPropDeafaults(noodlNode, nodeDef)

			// Запустим функцию инициализации один раз.
			if (nodeDef.beforeComponent?.initialize && noodlNode.firstRun)
				await nodeDef.beforeComponent?.initialize(noodlNode.props, noodlNode, {
					inputs: getNodeInputDefs(nodeDef, versions),
					outputs: nodeDef.inNode?.outputs || [],
				})

			// Отличим JS от React по наличию reactKey у ноды.
			if (!noodlNode.reactKey) await runReactiveJsFunc(noodlNode, nodeDef as JsNodeDef, inputDef)
			else noodlNode.forceUpdate()

			noodlNode.firstRun = false
			noodlNode.scheduledRun = false // Вернем возможность запуска обработки портов.
		})
	}
}
