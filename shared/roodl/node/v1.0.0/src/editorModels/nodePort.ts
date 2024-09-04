/* Функция подготавливает порты для ноды и конвертирует параметры, заданные в редакторе. */

import { getNodePort, type NodePort, type PortDef } from '@shared/port-v1.0.0';
import type { GraphModelNode, JsNodeVersions, NodeContext, NodeDef, ReactNodeVersions } from '../../main';
import { getCustomPropsPort, getCustomPropsPortDef } from './customProps';
import { getVersionPort, getVersionPortDef } from './version';
import { getConverted, prepareParameters, validateParameterValues, validateType } from './parameter';
import { hasWarnings } from './warning';
import { validateNode } from './node';

export const getNodeInputDefs = (nodeDef: NodeDef, versions: JsNodeVersions | ReactNodeVersions) => [
	getVersionPortDef(versions),
	...(nodeDef.inputs || []),
	getCustomPropsPortDef(),
];

export const handleNodePorts = async (
	model: GraphModelNode,
	context: NodeContext,
	versions: JsNodeVersions | ReactNodeVersions
) => {
	const nodeDef = versions[model.parameters.version];

	prepareParameters(model, context, versions);
	setNodePorts(model, context, versions);
	if (hasWarnings(model, context)) return;
	validateParameterValues(model, context, versions);
	if (hasWarnings(model, context)) return;
	if (nodeDef.transform) {
		const ports = nodeDef.transform(
			model.parametersCache,
			R.libs.just.clone({ inputs: nodeDef.inputs || [], outputs: nodeDef.outputs || [] })
		);

		if (ports) {
			nodeDef.inputs = ports.inputs;
			nodeDef.outputs = ports.outputs;
			setNodePorts(model, context, versions);
		}
	}
	if (hasWarnings(model, context)) return;
	await validateNode(model, context, versions);
};

const setNodePorts = (model: GraphModelNode, context: NodeContext, versions: JsNodeVersions | ReactNodeVersions) => {
	let nodePorts: NodePort[] = [getVersionPort(versions)];

	const inputDefs = versions[model.parameters.version].inputs || [];
	const outputDefs = versions[model.parameters.version].outputs || [];

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
				const newInputDef = inputDef.transform(model.parametersCache, inputDef) as PortDef;
				// Нужно восстановить дефолт и проверить его тип, если еще нет значения.
				if (newInputDef.default !== undefined && model.parametersCache[newInputDef.name] === undefined) {
					model.parameters[newInputDef.name] = newInputDef.default;
					model.parametersCache[inputDef.name] = getConverted(model, context, newInputDef);
					validateType(model, context, newInputDef);
				}
				nodePorts.push(getNodePort('input', newInputDef));
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
				nodePorts.push(getNodePort('input', outputDef.transform(model.parametersCache, outputDef) as PortDef));
				transformed = true;
			}

			if (!filtered && !transformed) nodePorts.push(getNodePort('output', outputDef));
		}
	}

	if (!versions[model.parameters.version].disableCustomProps) nodePorts.push(getCustomPropsPort());

	context.editorConnection.sendDynamicPorts(model.id, nodePorts);
};
