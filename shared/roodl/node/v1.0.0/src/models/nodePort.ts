/* Функция подготавливает порты для ноды и конвертирует параметры, заданные в редакторе. */

import { getNodePort, type NodePort, type PortDef } from '@shared/port-v1.0.0';
import type { JsVersions, NoodlNode } from '../../types';
import { getConverted, validateValueType } from './value';
import { getCustomPropsPortDef } from './customProps';
import { getVersionPortDef } from './version';
import { clearWarning } from './warning';

export const cachePortDefs = (noodlNode: NoodlNode, versions: JsVersions) => {
	const nodeDef = versions[noodlNode.model.parameters.version];

	if (noodlNode.model.parameters?.version && noodlNode.model.portDefsCache) {
		noodlNode.model.portDefsCache.inputs = [getVersionPortDef(versions), ...(nodeDef?.inputs || [])];
		if (!nodeDef.disableCustomProps) noodlNode.model.portDefsCache.inputs.push(getCustomPropsPortDef());
		noodlNode.model.portDefsCache.outputs = nodeDef?.outputs || [];
	}
};

export const setNodePorts = (noodlNode: NoodlNode, versions: JsVersions) => {
	let nodePorts: NodePort[] = [];

	if (noodlNode.model.parameters?.version) {
		const inputDefs = noodlNode.model.portDefsCache?.inputs || [];
		const outputDefs = noodlNode.model.portDefsCache?.outputs || [];

		let resultNodePorts: NodePort[] = [];
		// Нужно обрабатывать инпуты и аутпуты отдельно, т.к. название может совпадать.
		for (const inputDef of inputDefs) {
			let filtered = false;
			let transformed = false;

			if (inputDef) {
				// Зависимость.
				if (inputDef.dependsOn && !inputDef.dependsOn(noodlNode.propsCache)) {
					delete noodlNode.propsCache[inputDef.name];
					filtered = true;
				}
				// Трансформация.
				if (!filtered && inputDef.transform) {
					const newInputDef = inputDef.transform(noodlNode.propsCache, inputDef) as PortDef;
					// Нужно восстановить дефолт и проверить его тип, если еще нет значения.
					if (newInputDef.default !== undefined && noodlNode.model.parameters[newInputDef.name] === undefined) {
						noodlNode.propsCache[newInputDef.name] = getConverted(noodlNode, newInputDef, newInputDef.default);
						validateValueType(noodlNode, newInputDef, noodlNode.propsCache[newInputDef.name]);
					}
					resultNodePorts.push(getNodePort('input', newInputDef));
					transformed = true;
				}

				if (!filtered && !transformed) resultNodePorts.push(getNodePort('input', inputDef));
			}
		}
		for (const outputDef of outputDefs) {
			let filtered = false;
			let transformed = false;

			if (outputDef) {
				// Зависимость.
				if (outputDef.dependsOn && !outputDef.dependsOn(noodlNode.propsCache)) {
					delete noodlNode.outputPropValues[outputDef.name];
					filtered = true;
				}
				// Трансформация.
				if (!filtered && outputDef.transform) {
					resultNodePorts.push(getNodePort('input', outputDef.transform(noodlNode.propsCache, outputDef) as PortDef));
					transformed = true;
				}

				if (!filtered && !transformed) resultNodePorts.push(getNodePort('output', outputDef));
			}
		}

		nodePorts = resultNodePorts;
	}

	noodlNode.context.editorConnection.sendDynamicPorts(noodlNode.id, nodePorts);
};

// Установка значений с установленных параметров портов.
export const setValuesFromParameters = (noodlNode: NoodlNode) => {
	const inputDefs = noodlNode.model.portDefsCache?.inputs || [];

	for (const inputDef of inputDefs) {
		const inputName = inputDef.name;

		if (inputDef) {
			// Параметр установлен.
			if (noodlNode.model.parameters[inputName] !== undefined)
				noodlNode.propsCache[inputName] = getConverted(noodlNode, inputDef, noodlNode.model.parameters[inputName]);
			// Параметра нет, но есть дефолт.
			else if (inputDef.default !== undefined)
				noodlNode.propsCache[inputName] = getConverted(noodlNode, inputDef, inputDef.default);
			// Параметра нет и нет дефолта.
			else delete noodlNode.propsCache[inputName];

			// Нужно сбросить ошибку. Поймал это в варианте, когда предыдущая валидация значения не прошла и установлено новое значение.
			clearWarning(noodlNode, inputDef.displayName);

			// Валидация типа. Внтури пропустит, если undefined.
			validateValueType(noodlNode, inputDef, noodlNode.propsCache[inputDef.name]);
		}
	}
};
