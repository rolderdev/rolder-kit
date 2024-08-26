/* Интеграция нод в Roodl.
Оба вида нод не проверяют props на изменения. Предполагается, что это должен решать разработчик ноды.
JS и React используют один и тот же код (как это делает сам Roodl под капотом), но React есть отличия:
	1. Для React module.ts не используется, он только для JS. Вместо этого устанавливается getReactComponent, в которой идет обработка и 
		возвращается React-компонента.
	2. Для JS module.ts разруливает варианты статичного и динамичного импорта. Для React используется Suspense, который сам
	разруливает оба варианта импорта.
	3. Асинхронная JS-нода не запускается снова пока работает предыдущая итерация. React запускается (рендерится) всегда.
	4. В schedule.ts JS-нода передает props в указанную функцию (сигнал или reactive), React-нода просто обновляет props из кеша и запускает
		рендер через встроенную в Roodl функцию forceUpdate. */

import { Suspense } from 'react';
import { forwardRef } from 'react';
import { getNodePort, type PortDef } from '@shared/port-v1.0.0';
import type {
	GraphModel,
	GraphModelNode,
	JsRoodlNode,
	JsNodeVersions,
	NodeColor,
	NodeContext,
	RoodlNode,
	ReactRoodlNode,
	Props,
} from '../types';
import { getVersionPortDef, validateVersion } from './models/version';
import { cachePortDefs, setNodePorts, setValuesFromParameters } from './models/nodePort';
import { schedule } from './models/schedule';
import { validateValueType } from './models/value';
import { getCustomPropsPortDef } from './models/customProps';
import { getModule } from './models/module';

const getShared = (nodeName: string, versions: JsNodeVersions, docs?: string) =>
	({
		name: `rolder-kit.api-v1.${nodeName}`,
		displayName: '*' + nodeName,
		docs,
		// Выдадим над нодой короткую информацию о праметрах.
		getInspectInfo() {
			const version = this._inputValues?.version;
			let output;
			const getInspectInfo = versions[version]?.getInspectInfo;
			if (getInspectInfo) output = getInspectInfo(this.propsCache || {}, this.outputPropValues || {});
			return output;
		},
		initialize: function () {
			this.propsCache = { noodlNode: this }; // Наполняется постепенно. Для конвертированных и проверенных на тип данных.
			this.outputPropValues = {}; // Хранилище выходных props.
			this.scheduledRun = false;
			this.scheduledModuleRun = false;
			this.initializeExecuted = false;
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
								//console.log('from editor', inputName, this.firstRun);
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
									setNodePorts(this);
								}
								// Если есть transform на уровне всей ноды, значит нужно взять с него новую декларацию и повториь процесс выше.
								// Повтор возникает из-за того, что разработчику в transform нужны актуальные данные в значениях параметров.
								if (nodeDef.transform) {
									// Нужен повтроить, чтобы transform имел актуальные props.
									setValuesFromParameters(this);
									// Нужно клонировать декларацию, чтобы разработчик мог менять массив без последствий.
									this.model.portDefsCache = nodeDef.transform(this.propsCache, R.libs.just.clone(this.model.portDefsCache));
									setValuesFromParameters(this);
									setNodePorts(this);
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

			graphModel.on(`nodeAdded.rolder-kit.api-v1.${nodeName}`, function (model: GraphModelNode) {
				if (!model.portDefsCache) model.portDefsCache = { inputs: [], outputs: [] }; // Кеш деклараций портов.
				let startInputDefs = [getVersionPortDef(versions)]; // Порты, которые нужные в кеше сразу.
				model.portDefsCache.inputs = startInputDefs;
				// Установка порта с версией запускает весь процесс.
				// Если в праметрах нет версии, нужно зарегестрировать порт с версией.
				// Когда есть, процесс запуститься в любом случае через registerInputIfNeeded.
				if (!model.parameters.version) {
					context.editorConnection.sendDynamicPorts(model.id, [getNodePort('input', startInputDefs[0])]);
					// Руганемся, когда нет версии.
					validateVersion(model, context);
				} else {
					// Первый запуск, когда нода добавлена.
					model.firstRun = true; // Для варианта, когда выбрана версия, но все параметры дефолты.
					if (!versions[model.parameters.version].disableCustomProps) model.portDefsCache.inputs.push(getCustomPropsPortDef());
				}

				model.on('parameterUpdated', function (port) {
					if (port.name === 'version') {
						// Руганемся, покажем/скроем ошибку при смене версии и оставим только порт версии, когда она не выбрана.
						validateVersion(model, context);
						if (port.value === undefined) {
							context.editorConnection.sendDynamicPorts(model.id, [getNodePort('input', startInputDefs[0])]);
						} else model.firstRun = true; // После установки версии нужно запустить модуль первый раз.
					}
				});
			});
		},
	} as RoodlNode);

export const jsNode = (nodeName: string, versions: JsNodeVersions, params?: { docs?: string; color?: NodeColor }) =>
	({
		color: params?.color || 'green',
		...getShared(nodeName, versions, params?.docs),
	} as JsRoodlNode);

export const reactNode = (nodeName: string, versions: JsNodeVersions, params?: { docs?: string; allowChildren?: boolean }) =>
	({
		noodlNodeAsProp: true,
		allowChildren: params?.allowChildren || false,
		useVariants: false,
		...getShared(nodeName, versions, params?.docs),
		getReactComponent() {
			return forwardRef(function (p: Props, ref) {
				// Не будем выдавать компоненту пока не выбрана версия.
				if (!p.version) return null;
				else {
					const ReactComponent = getModule(versions[p.version]);
					// Если ошибка в импорте, вернем null.
					if (!ReactComponent) return null;
					else {
						// Передадим готовые props и поднимем выше ref, чтобы родители могли управлять.
						// Обернем в Suspense, чтобы не разруливать вручную динамичный и статичный импорты.
						return (
							<Suspense fallback={null}>
								<ReactComponent {...p} ref={ref} />
							</Suspense>
						);
					}
				}
			});
		},
	} as ReactRoodlNode);
