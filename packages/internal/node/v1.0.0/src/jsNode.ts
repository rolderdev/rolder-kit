/* Интеграция JS-ноды в Roodl. */

import clone from 'just-clone';
import { getNodePort, type PortDef } from '@packages/port';
import type { GraphModel, GraphModelNode, JsNodeDef, JsVersions, NodeColor, NodeContext } from '../types';
import { getVersionPortDef, validateVersion } from './models/version';
import { cachePortDefs, setNodePorts, setValuesFromParameters } from './models/nodePort';
import { schedule } from './models/schedule';
import { validateValueType } from './models/value';
import { getCustomPropsPortDef } from './models/customProps';

export const jsNode = (nodeName: string, versions: JsVersions, params?: { color?: NodeColor; docs?: string }) => {
	return {
		name: `rolder-kit.${nodeName}`,
		displayName: nodeName,
		color: params?.color || 'green',
		docs: params?.docs,
		initialize: function () {
			this.propsCache = { noodlNode: this }; // Наполняется постепенно. Для конвертированных и проверенных на тип данных.
			this.outputPropValues = {}; // Хранилище выходных props.
			this.scheduledRun = false;
			this.scheduledModuleRun = false;
		},
		// Выдадим над нодой короткую информацию о праметрах.
		getInspectInfo() {
			const version = this._inputValues.version;
			let output = undefined;
			const getInspectInfo = versions[version]?.getInspectInfo;
			if (getInspectInfo) output = getInspectInfo(this.propsCache || {}, this.outputPropValues || {});
			return output;
		},
		methods: {
			// Регистрирует инпут и слушает изменения.
			registerInputIfNeeded: function (inputName: string) {
				if (this.hasInput(inputName)) return;
				this.registerInput(inputName, {
					set: function (value: unknown) {
						const v = this._inputValues.version;
						const nodeDef = versions[v];
						const inputDef = this.model.portDefsCache?.inputs.find((i: PortDef) => i.name === inputName) as PortDef | undefined;

						// Значения с подключений записываются в кеш здесь.
						// Значения с параметров ноды записываются в кеш через setValuesFromParameters.
						// Ключевая разница в том, что для редактора из-за дефолтов приходится проверять все порты. Это влияет только на рарзработку,
						// т.к. в runtime параметры с редактора прилетают лишь раз.
						// Здесь все то, что запускается для каждого порта при получении данных. schedule запускается после обработки всех инпутов,
						// т.е. там запускается то, что нужно делать когда есть все данные.
						if (nodeDef && inputDef) {
							// Значение пришло через подключение.
							if (this._hasInputBeenSetFromAConnection(inputName)) {
								//console.log('from connection', inputName, value);
								this.propsCache[inputName] = value;
								validateValueType(this, inputDef, value);
								// Отложенный обработчик.
								schedule(this, nodeDef, inputDef, inputDef.type === 'signal' && value === true);
							} else {
								//console.log('from editor', inputName, value);
								// Значение пришло с редактора.
								// Нужно записать версию отдельно - setValuesFromParameters использует порты с декларации, где нет версии.
								if (inputName === 'version') this.propsCache.version = value;
								// Если есть transform, обработаем только первый раз, чтобы transform получил готовые данные.
								if (this.model.firstRun || !nodeDef.transform) {
									// Сохраним делкарачию портов в кеше, чтобы функции могли доверять ей, если есть transform.
									cachePortDefs(this, versions);
									// Запишем в кеш значения с параметров редактора, восстановив дефолты, сконвертировав и проверив тип.
									setValuesFromParameters(this);
									// Переустановим порты на основе только что записанных значений с параметров.
									setNodePorts(this, versions);
								}
								// Если есть transform на уровне всей ноды, значит нужно взять с него новую декларацию и повториь процесс выше.
								// Повтор возникает из-за того, что разработчику в transform нужны актуальные данные в значениях параметров.
								if (nodeDef.transform) {
									// Нужно клонировать декларацию, чтобы разработчик мог менять массив без последствий.
									this.model.portDefsCache = nodeDef.transform(this.propsCache, clone(this.portDefsCache));
									setValuesFromParameters(this);
									setNodePorts(this, versions);
								}
								// Отложенный обработчик.
								schedule(this, nodeDef, inputDef, inputDef.type === 'signal' && value === true);
							}
						}
					},
				});
			},
			// Регистрируем аутпут и укажем как барть его с хранилища. sendOutput потом использует его для отправки.
			registerOutputIfNeeded: function (name: string) {
				if (this.hasOutput(name)) return;
				this.registerOutput(name, {
					getter: () => this.outputPropValues?.[name],
				});
			},
		},
		setup: function (context: NodeContext, graphModel: GraphModel) {
			if (!context.editorConnection || !context.editorConnection.isRunningLocally()) return;

			graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
				if (!node.portDefsCache) node.portDefsCache = { inputs: [], outputs: [] }; // Кеш деклараций портов.
				let startInputDefs = [getVersionPortDef(versions)]; // Порты, которые нужные в кеше сразу.
				node.portDefsCache.inputs = startInputDefs;
				// Установка порта с версией запускает весь процесс.
				// Если в праметрах нет версии, нужно зарегестрировать порт с версией.
				// Когда есть, процесс запуститься в любом случае через registerInputIfNeeded.
				if (!node.parameters.version)
					context.editorConnection.sendDynamicPorts(node.id, [getNodePort('input', startInputDefs[0])]);
				else {
					node.firstRun = true; // Для варианта, когда выбрана версия, но все параметры дефолты.
					// Руганемся, когда нет версии.
					validateVersion(node, context);
					if (!versions[node.parameters.version].disableCustomProps) node.portDefsCache.inputs.push(getCustomPropsPortDef());
				}

				node.on('parameterUpdated', function (port) {
					if (port.name === 'version') {
						// Руганемся, покажем/скроем ошибку при смене версии и оставим только порт версии, когда она не выбрана.
						validateVersion(node, context);
						if (port.value === undefined) {
							context.editorConnection.sendDynamicPorts(node.id, [getNodePort('input', startInputDefs[0])]);
						} else node.firstRun = true; // После установки версии нужно запустить модуль первый раз.
					}
				});
			});
		},
	} as JsNodeDef;
};
