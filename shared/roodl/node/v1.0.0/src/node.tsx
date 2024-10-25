/* Интеграция нод в Roodl. */

import { Suspense, forwardRef } from 'react'
import type {
	GraphModel,
	GraphModelNode,
	InspectInfo,
	JsNodeVersions,
	JsRoodlNode,
	NodeColor,
	NodeContext,
	NodeDef,
	Props,
	ReactNodeVersions,
	ReactRoodlNode,
	RoodlNode,
} from '../main'
import { getNodeInputDefs, handleNodePorts } from './editorModels/nodePort'
import { getConvertedParameter } from './editorModels/parameter'
import { getVersionPort, validateVersion } from './editorModels/version'
import { hasWarnings } from './editorModels/warning'
import { validatePropType, validatePropValue } from './runtimeModels/prop'
import { getModule, runSignal } from './runtimeModels/run'
import scheduleRun from './runtimeModels/scheduleRun'

const getShared = (nodeName: string, versions: JsNodeVersions | ReactNodeVersions, docs?: string) =>
	({
		name: `rolder-kit.api-v1.${nodeName}`,
		displayName: `*${nodeName}`,
		docs,
		initialize: function () {
			this.firstRun = true
			this.scheduledRun = false
			this.props = {} // Хранилище входных props.
			this.outputPropValues = {} // Хранилище выходных props.
		},
		// Выдадим над нодой короткую информацию о праметрах.
		getInspectInfo() {
			const version = this._inputValues?.version
			let output: InspectInfo | InspectInfo[] | undefined
			const getInspectInfo = versions[version]?.afterNode?.getInspectInfo
			if (getInspectInfo) output = getInspectInfo(this.props || {}, this.outputPropValues || {}, this as any)
			return output
		},
		methods: {
			// Регистрирует инпут и слушает изменения.
			registerInputIfNeeded: function (inputName: string) {
				if (this.hasInput(inputName)) return
				this.registerInput(inputName, {
					set: async function (value: unknown) {
						const v = this._inputValues.version
						this.props.version = v
						const nodeDef = versions[v] as NodeDef | undefined
						const inputDef = nodeDef ? getNodeInputDefs(nodeDef, versions)?.find((i) => i.name === inputName) : undefined

						if (nodeDef && inputDef) {
							// Значение пришло через подключение.
							if (this._hasInputBeenSetFromAConnection(inputName)) {
								//console.log('from connection', nodeName, inputName, value);
								// Нужно клонировать сложные типы, чтобы сравнение в компонентах работало, т.к. разработчик может мутировать.
								if (value && typeof inputDef.type === 'string' && ['array', 'objectEval', 'funcEval'].includes(inputDef.type)) {
									this.props[inputName] = R.libs.just.clone(value)
								} else this.props[inputName] = value
								// Валидириуем тип и значение в runtime, если не задеплоено.
								if (!Noodl.deployed) {
									validatePropType(this, inputDef, value)
									validatePropValue(this, inputDef)
									if (hasWarnings(this.model)) return
								}
							} else {
								//console.log('from editor', nodeName, inputName, value, this.props.noodlNode);
								// Значение пришло с редактора. Не отрабатывает дефолты редактора, это дклает scheduleRun.
								this.props[inputName] = getConvertedParameter(this.model, this.context, inputDef)
							}

							// Отсановим, если есть ошибки во время разработки.
							if (!Noodl.deployed && hasWarnings(this.model)) return

							// Разведем сигнал и обновление props. Реагируем на false на случай одновременной подачи props и сигнала.
							if (inputDef.type === 'signal') {
								if (value === false) runSignal(this, nodeDef, inputDef)
							} else scheduleRun(this, nodeDef, inputDef, versions)
						}
					},
				})
			},
			// Зарегистрируем аутпут и укажем как брать его с хранилища. sendOutput потом использует его для отправки.
			registerOutputIfNeeded: function (name: string) {
				if (this.hasOutput(name)) return
				this.registerOutput(name, { getter: () => this.outputPropValues?.[name] })
			},
		},
		setup: (context: NodeContext, graphModel: GraphModel) => {
			// Только во время разарботки в Roodl.
			if (!context.editorConnection || !context.editorConnection.isRunningLocally()) return

			const versionPort = getVersionPort(versions)

			graphModel.on(`nodeAdded.rolder-kit.api-v1.${nodeName}`, async (model: GraphModelNode) => {
				model.parametersCache = {}
				model.portDefsCache = { inputs: [], outputs: [] }
				model.warnings = new Map()

				if (!model.parameters.version) {
					context.editorConnection.sendDynamicPorts(model.id, [versionPort])
					validateVersion(model, context)
				} else await handleNodePorts(model, context, versions)

				model.on('parameterUpdated', async (port) => {
					//if (port.state !== 'stop') {
					if (port.name === 'version') {
						validateVersion(model, context)
						if (port.value === undefined) context.editorConnection.sendDynamicPorts(model.id, [versionPort])
						else await handleNodePorts(model, context, versions)
					} else await handleNodePorts(model, context, versions)
					//}
				})
			})
		},
	}) as RoodlNode

export const jsNode = (nodeName: string, versions: JsNodeVersions, params?: { docs?: string; color?: NodeColor }) =>
	({
		color: params?.color || 'green',
		...getShared(nodeName, versions, params?.docs),
	}) as JsRoodlNode

export const reactNode = (nodeName: string, versions: JsNodeVersions, params?: { docs?: string; allowChildren?: boolean }) => {
	return {
		allowChildren: params?.allowChildren || false,
		useVariants: false,
		noodlNodeAsProp: true,
		...getShared(nodeName, versions, params?.docs),
		getReactComponent() {
			return forwardRef((p: Props, ref) => {
				if (p.noodlNode.firstRun) return null

				const ReactComponent = getModule(versions[p.version])
				if (!ReactComponent) return null

				// Передадим готовые props и поднимем выше ref, чтобы родители могли управлять.
				// Обернем в Suspense, чтобы не разруливать вручную динамичный и статичный импорты.
				return (
					<Suspense fallback={null}>
						<ReactComponent {...p} ref={ref} />
					</Suspense>
				)
			})
		},
	} as ReactRoodlNode
}
