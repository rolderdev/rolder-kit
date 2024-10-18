import type { ResultPortDef } from '@shared/port-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'
import type { Warnings } from './src/editorModels/warning'

export { jsNode, reactNode } from './src/node'

// ================== JS ==================== //

export type BaseJsProps = BaseProps
export type JsNodeVersions = { [key: string]: JsNodeDef }
export type JsRoodlNode = RoodlNode & { color?: NodeColor }
export type JsNodeDef = NodeDef & { afterNode?: { triggerOnInputs?(p: { [x: string]: any }): string[] } }
export type JsComponent = { reactive?: (p: unknown, noodlNode: NoodlNode) => void | Promise<void> } & {
	[signal: string]: (p: unknown, noodlNode: NoodlNode) => void | Promise<void>
}

// ================= React ================== //

export type BaseReactProps = BaseProps & {
	noodlNode: NoodlNode
	children?: React.ReactNode
	style: { [x: string]: unknown }
	styles: { [x: string]: unknown }
}
export type ReactNodeVersions = { [key: string]: ReactNodeDef }
export type ReactRoodlNode = RoodlNode & { getReactComponent(): any }
export type ReactNodeDef = NodeDef

// ================ Shared ================== //

export type BaseProps = {
	version: string
	customProps?: { [x: string]: unknown }
}
export type Props = { [name: string]: any }
export type InspectInfo = { type: 'value' | 'text' | 'color'; value: any }
type HashTag = '#expreimental' | '#pre-release' | '#deprecated'

export type ResultPortDefs = { inputs: ResultPortDef[]; outputs: ResultPortDef[] }

// Декларация.
export type NodeDef = {
	hashTag?: HashTag
	module: { static?: any; dynamic?: any }
	// Процесс.
	inNode?: {
		inputs?: ResultPortDef[]
		outputs?: ResultPortDef[]
	}
	afterNode?: {
		transformPorts?(p: Props, portDefs: ResultPortDefs): Promise<void>
		validate?(p: Props, model: GraphModelNode): Promise<boolean | string>
		getInspectInfo?(p: Props, outProps: { [x: string]: any }, noodlNode: NoodlNode): InspectInfo | InspectInfo[]
	}
	beforeComponent?: {
		initialize?(p: Props, noodlNode: NoodlNode, portDefs: ResultPortDefs): Promise<void>
	}
	// Опции.
	disableCustomProps?: boolean
}

// Нода для типизации в node.ts
export type RoodlNode = {
	name: string
	displayName: string
	docs?: string

	props?: Props
	outputPropValues?: Props

	firstRun?: boolean
	scheduledRun?: boolean

	_inputValues?: Props
	setValue?(inputName: string, value: any): void
	initialize(): void
	getInspectInfo?(): void
	changed?: {
		[key: string]: (this: RoodlNode, newValue: string, oldValue: string) => void
	}
	setInputsValue?: (inputName: string, inputValue: any) => void
	signals?: {
		[key: string]: {
			displayName: string
			signal: (this: NoodlNode) => void
		}
	}
	methods: { [key: string]: any }
	setup(context: NodeContext, graphModel: GraphModel): void
	model?: GraphModel
}

// Оригинальная нода Noodl
export type NoodlNode = {
	firstRun?: boolean
	scheduledRun?: boolean

	hasOutput(name: string): boolean
	flagOutputDirty(name: string): boolean
	flagAllOutputsDirty(): boolean
	sendSignalOnOutput(name: string): void
	scheduleAfterInputsHaveUpdated?: any
	///
	boundingBoxObserver: {
		isRunning: boolean
		numBoundingBoxObservers: number
		pollDelay: number
		target: any
		callback: () => any
	}
	childIndex: number
	children: NoodlNode[]
	childrenCount: number
	clientBoundingRect: any
	context: NodeContext
	forceUpdateScheduled: boolean
	id: string
	innerReactComponentRef: any
	model: GraphModelNode
	nodeScope: any
	noodlNodeAsProp: boolean
	outputPropValues: any
	parent: NoodlNode
	props: any
	reactComponentRef: any
	reactKey: string
	renderedAtFrame: number
	style: any
	updateChildIndiciesScheduled: boolean
	updateOnDirtyFlagging: boolean
	useFrame: boolean
	wantsToBeMounted: boolean
	_afterInputsHaveUpdatedCallbacks: any
	_deleteListeners: any
	_deleted: boolean
	_dirty: boolean
	_inputConnections: any
	_inputValues: any
	_inputValuesQueue: any
	_inputs: any
	_internal: any
	_isFirstUpdate: boolean
	_isUpdating: boolean
	_outputList: any
	_outputs: any
	_signalsSentThisUpdate: any
	_updateIteration: number
	_updatedAtIteration: number
	_valuesFromConnections: any
	removeChild: (reactNode: React.ReactNode) => void
	defineModule(module: {
		name: string
		nodes?: JsRoodlNode[]
		reactNodes?: ReactRoodlNode[]
		settings?: { [x: string]: any }[]
	}): void
	_onNodeDeleted: () => void
	Object: {
		create: (item: Item) => Item & { collapse: () => void; hierarchyNode: any }
	}
	Objects: { [itemId: string]: Item & { collapse: () => void; hierarchyNode: any } }
	forceUpdate: () => void
	getProjectSettings: () => Props
	_hasInputBeenSetFromAConnection: (inputName: string) => boolean
	Events: {
		emit: (eventName: string, eventData?: Props) => boolean
		on: (eventName: string, callBack: (eventData?: Props) => void) => void
	}
	deployed: boolean
}

export type NodeContext = {
	callbacksAfterUpdate: any
	componentModels: { [x: string]: any }
	connectionPulsingCallbackScheduled: boolean
	connectionsToPulse: any
	connectionsToPulseChanged: boolean
	currentFrameTime: number
	debugInspectors: any
	debugInspectorsEnabled: boolean
	editorConnection: any
	eventEmitter: { _events: any; _eventsCount: number; _maxListeners: number }
	eventSenderEmitter: {
		_events: any
		_eventsCount: number
		_maxListeners: number
	}
	frameNumber: number
	globalValues: any
	globalsEventEmitter: {
		_events: any
		_eventsCount: number
		_maxListeners: number
	}
	graphModel: GraphModel
	isUpdating: boolean
	nodeRegister: { _constructors: any; context: any }
	onClosePopup: () => any
	onShowPopup: () => any
	platform: {
		webSocketOptions: any
		requestUpdate: any
		getCurrentTime: any
		objectToString: any
	}
	rootComponent: {
		id: string
		context: any
		_dirty: boolean
		_inputs: any
		_inputValues: any
	}
	runningInEditor: boolean
	setNodeFocused: () => any
	styles: {
		graphModel: any
		nodeRegister: any
		styles: any
		getNodeScope: any
	}
	timerScheduler: { runningTimers: any; newTimers: any; requestFrame: any }
	updateIteration: number
	variants: any
	warningTypes: any
	_dirtyNodes: any
	_outputHistory: any
	_signalHistory: any
}

export type GraphModel = {
	componentIndex: any
	componentToBundleMap: { size: number }
	components: { [x: string]: any }
	listeners: { [x: string]: any }
	listenersWithRefs: { [x: string]: any }
	metadata: {
		styles: { colors: { [x: string]: any }; text: { [x: string]: any } }
	}
	rootComponent: string
	routerIndex: { routers: any; pages: any }
	settings: { navigationPathType: 'path' }
	variants: any
	on(listener: string, callback: (node: GraphModelNode) => void): void
	parametersCache?: Props
}

export type GraphModelNode = {
	parametersCache: Props
	portDefsCache: ResultPortDefs
	warnings: Warnings
	setParameter(name: string, value: any, state: 'stop'): void

	////
	children: GraphModelNode[]
	component: any
	id: string
	inputPorts: any
	inputs: any
	listeners: { parameterUpdated: any }
	listenersWithRefs: {
		parameterUpdated: any
		variantUpdated: any
		inputPortRemoved: any
		outputPortRemoved: any
	}
	outputPorts: any
	outputs: any
	parameters: Props
	parent: GraphModelNode
	type: string
	on(listener: string, callback: (p: { name: string; state: string; value: any }) => void): void
}

type ColorTypes = {
	purple: 'component'
	green: 'data'
	visual: 'blue'
	default: 'default'
	grey: 'default'
}
export type NodeColor = keyof ColorTypes | ColorTypes[keyof ColorTypes]
