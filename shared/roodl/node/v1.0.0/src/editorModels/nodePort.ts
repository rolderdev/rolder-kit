/* Функция подготавливает порты для ноды и конвертирует параметры, заданные в редакторе. */

import { getNodePort, type NodePort } from '@shared/port-v1.0.0';
import type { GraphModelNode, JsNodeVersions, NodeContext, NodeDef, ReactNodeVersions } from '../../main';
import { getCustomPropsPortDef } from './customProps';
import { getVersionPortDef } from './version';
import { getConverted, prepareParameters, validateParameterValues, validateType } from './parameter';
import { hasWarnings } from './warning';
import { validateNode } from './node';

export const getNodeInputDefs = (nodeDef: NodeDef, versions: JsNodeVersions | ReactNodeVersions) => [
	getVersionPortDef(versions),
	...(nodeDef.inputs || []),
	...(!nodeDef.disableCustomProps ? [getCustomPropsPortDef()] : []),
];

export const handleNodePorts = async (
	model: GraphModelNode,
	context: NodeContext,
	versions: JsNodeVersions | ReactNodeVersions
) => {
	const nodeDef = versions[model.parameters.version];

	// Подготовим кеш деклараций портов, чтобы можно было мутировать.
	model.portDefsCache.inputs = R.libs.just.clone([getVersionPortDef(versions), ...(nodeDef.inputs || [])]);
	if (!versions[model.parameters.version].disableCustomProps) model.portDefsCache.inputs.push(getCustomPropsPortDef());
	model.portDefsCache.outputs = R.libs.just.clone(nodeDef.outputs || []);

	prepareParameters(model, context, versions);
	setNodePorts(model, context, versions);
	if (hasWarnings(model, 'convert') || hasWarnings(model, 'type')) return;
	validateParameterValues(model, context, versions);
	if (hasWarnings(model, 'value')) return;
	if (nodeDef.transform) {
		nodeDef.transform(model.parametersCache, model.portDefsCache);
		setNodePorts(model, context, versions);
	}
	if (hasWarnings(model, 'convert') || hasWarnings(model, 'type')) return;
	await validateNode(model, context, versions);
};

const setNodePorts = (model: GraphModelNode, context: NodeContext, versions: JsNodeVersions | ReactNodeVersions) => {
	let nodePorts: NodePort[] = [];

	const inputDefs = model.portDefsCache.inputs;
	const outputDefs = model.portDefsCache.outputs;

	// Нужно обрабатывать инпуты и аутпуты отдельно, т.к. название может совпадать.
	for (const inputDef of inputDefs) {
		let filtered = false;
		let transformed = false;

		if (inputDef) {
			// Зависимость.
			if (inputDef.dependsOn && !inputDef.dependsOn(model.parametersCache)) {
				delete model.parametersCache[inputDef.name];
				delete model.parameters[inputDef.name];
				filtered = true;
			}
			// Трансформация.
			if (!filtered && inputDef.transform) {
				// Мутация.
				inputDef.transform(model.parametersCache, inputDef);
				// Нужно восстановить дефолт и проверить его тип, если еще нет значения.
				if (inputDef.default !== undefined && model.parametersCache[inputDef.name] === undefined) {
					model.parameters[inputDef.name] = inputDef.default;
					model.parametersCache[inputDef.name] = getConverted(model, context, inputDef);
					validateType(model, context, inputDef);
				}
				nodePorts.push(getNodePort('input', inputDef));
				transformed = true;
			}

			if (!filtered && !transformed) nodePorts.push(getNodePort('input', inputDef));
		}
	}

	for (const outputDef of outputDefs) {
		let filtered = false;
		let transformed = false;

		if (outputDef) {
			// Зависимость.
			if (outputDef.dependsOn && !outputDef.dependsOn(model.parametersCache)) {
				//delete noodlNode.outputPropValues[outputDef.name];
				filtered = true;
			}
			// Трансформация.
			if (!filtered && outputDef.transform) {
				// Мутация.
				outputDef.transform(model.parametersCache, outputDef);
				nodePorts.push(getNodePort('input', outputDef));
				transformed = true;
			}

			if (!filtered && !transformed) nodePorts.push(getNodePort('output', outputDef));
		}
	}

	context.editorConnection.sendDynamicPorts(model.id, nodePorts);
};
