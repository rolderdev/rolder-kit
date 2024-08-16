import { ReactNode } from 'react';
import type { PortDef, NodePort } from '@shared/port-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';

// ================ JS ================== //

export type BaseJsProps = {
	noodlNode: NoodlNode;
	version: string;
	customProps?(p: Props): Props;
};

export type JsNodeVersions = {
	[key: string]: JsNodeDef;
};

export type JsNodeDef = {
	module: {
		static?: any;
		dynamic?: any;
	};
	hashTag?: HashTag;
	inputs?: PortDef[];
	outputs?: PortDef[];
	initialize?(p: Props): Promise<Props>;
	getInspectInfo?(p: Props, outProps: { [x: string]: any }): InspectInfo | InspectInfo[];
	triggerOnInputs?(p: { [x: string]: any }): string[];
	transform?(p: Props, portDefs: { inputs: PortDef[]; outputs: PortDef[] }): { inputs: PortDef[]; outputs: PortDef[] };
	disableCustomProps?: boolean;
};

export type JsNodeRoodlDef = {
	color?: NodeColor;

	/* propsCache?: { [x: string]: any };
	outputPropValues?: { [x: string]: any };
	firstRun?: boolean;
	scheduledRun?: boolean;
	scheduledModuleRun?: boolean;

	_inputValues?: any;
	_internal?: any;
	props?: { [x: string]: any };
	setValue?(inputName: string, value: any): void;
	initialize(): void;
	getInspectInfo?(): any;
	changed?: {
		[key: string]: (this: NodeRoodlDef, newValue: string, oldValue: string) => void;
	};
	scheduleAfterInputsHaveUpdated?: any;
	setInputsValue?: (inputName: string, inputValue: any) => void;
	signals?: {
		[key: string]: {
			displayName: string;
			signal: (this: NoodlNode) => void;
		};
	};
	methods: { [key: string]: any };
	setup(context: any, graphModel: any): void;
	addDeleteListener?: any;
	model?: any; */
};

// ================ React ================== //

/* export type BaseReactProps = {
	noodlNode: NoodlNode;
	children: ReactNode;
	version?: string;
	style: { [x: string]: any };
	customProps?: { [x: string]: any };
	innerProps?: { [x: string]: any };
	propsFunction?(p: Props): Props;
}; */

/* export type CompVersions = {
	[key: string]: CompDefinition;
};

export type CompDefinition = {
	module: {
		static?: any;
		dynamic?: any;
	};
	remote?: any;
	hashTag?: HashTag;
	inputs?: NodePort[];
	outputs?: NodePort[];
	getInspectInfo?(p: Props, outProps: { [x: string]: any }): InspectInfo | InspectInfo[];
}; */

/* export type ReactNodeDef = {
	name: string;
	displayName: string;
	docs?: string;
	noodlNodeAsProp: boolean;
	allowChildren: boolean;
	props?: any;
	currentPorts?: NodePort[] | {};
	initialize?(): void;
	getInspectInfo?(p: Props, outProps: { [x: string]: any }): InspectInfo | InspectInfo[];
	getReactComponent(): any;
	setValue?(inputName: string, value: any): void;
	scheduleAfterInputsHaveUpdated?: any;
	methods: { [key: string]: any };
	setup(context: any, graphModel: any): void;
	resultProps?: { [key: string]: any };
	addDeleteListener?: any;
	model?: any;
	nodeDoubleClickAction?: {
		focusPort: string;
	};
	useVariants: boolean;
}; */

// ================ Shared ================== //

type Props = { [name: string]: any };
type InspectInfo = { type: 'value' | 'text' | 'color'; value: any };
type HashTag = '#expreimental' | '#pre-release' | '#deprecated';

export type NodeRoodlDef = {
	name: string;
	displayName: string;
	docs?: string;

	propsCache?: { [x: string]: any };
	outputPropValues?: { [x: string]: any };
	firstRun?: boolean;
	scheduledRun?: boolean;
	scheduledModuleRun?: boolean;

	_inputValues?: any;
	//_internal?: any;
	props?: { [x: string]: any };
	setValue?(inputName: string, value: any): void;
	initialize(): void;
	getInspectInfo?(): any;
	changed?: {
		[key: string]: (this: NodeRoodlDef, newValue: string, oldValue: string) => void;
	};
	scheduleAfterInputsHaveUpdated?: any;
	setInputsValue?: (inputName: string, inputValue: any) => void;
	signals?: {
		[key: string]: {
			displayName: string;
			signal: (this: NoodlNode) => void;
		};
	};
	methods: { [key: string]: any };
	setup(context: any, graphModel: any): void;
	addDeleteListener?: any;
	model?: any;
};

export type NoodlNode = {
	propsCache: { [x: string]: any };
	firstRun?: boolean;
	scheduledRun?: boolean;
	scheduledModuleRun?: boolean;

	hasOutput(name: string): boolean;
	flagOutputDirty(name: string): boolean;
	flagAllOutputsDirty(): boolean;
	sendSignalOnOutput(name: string): void;
	scheduleAfterInputsHaveUpdated?: any;
	///
	boundingBoxObserver: {
		isRunning: boolean;
		numBoundingBoxObservers: number;
		pollDelay: number;
		target: any;
		callback: () => any;
	};
	childIndex: number;
	children: NoodlNode[];
	childrenCount: number;
	clientBoundingRect: any;
	context: NodeContext;
	forceUpdateScheduled: boolean;
	id: string;
	innerReactComponentRef: any;
	model: GraphModelNode;
	nodeScope: any;
	noodlNodeAsProp: boolean;
	outputPropValues: any;
	parent: NoodlNode;
	props: any;
	reactComponentRef: any;
	reactKey: string;
	renderedAtFrame: number;
	style: any;
	updateChildIndiciesScheduled: boolean;
	updateOnDirtyFlagging: boolean;
	useFrame: boolean;
	wantsToBeMounted: boolean;
	_afterInputsHaveUpdatedCallbacks: any;
	_deleteListeners: any;
	_deleted: boolean;
	_dirty: boolean;
	_inputConnections: any;
	_inputValues: any;
	_inputValuesQueue: any;
	_inputs: any;
	_internal: any;
	_isFirstUpdate: boolean;
	_isUpdating: boolean;
	_outputList: any;
	_outputs: any;
	_signalsSentThisUpdate: any;
	_updateIteration: number;
	_updatedAtIteration: number;
	_valuesFromConnections: any;
	removeChild: (reactNode: React.ReactNode) => void;
	defineModule(module: { nodes?: JsNodeDef[]; reactNodes?: ReactNodeDef[] }): void;
	_onNodeDeleted: () => void;
	Object: {
		create: (item: Item) => void;
	};
};

export type NodeContext = {
	callbacksAfterUpdate: any;
	componentModels: { [x: string]: any };
	connectionPulsingCallbackScheduled: boolean;
	connectionsToPulse: any;
	connectionsToPulseChanged: boolean;
	currentFrameTime: number;
	debugInspectors: any;
	debugInspectorsEnabled: boolean;
	editorConnection: any;
	eventEmitter: { _events: any; _eventsCount: number; _maxListeners: number };
	eventSenderEmitter: {
		_events: any;
		_eventsCount: number;
		_maxListeners: number;
	};
	frameNumber: number;
	globalValues: any;
	globalsEventEmitter: {
		_events: any;
		_eventsCount: number;
		_maxListeners: number;
	};
	graphModel: GraphModel;
	isUpdating: boolean;
	nodeRegister: { _constructors: any; context: any };
	onClosePopup: () => any;
	onShowPopup: () => any;
	platform: {
		webSocketOptions: any;
		requestUpdate: any;
		getCurrentTime: any;
		objectToString: any;
	};
	rootComponent: {
		id: string;
		context: any;
		_dirty: boolean;
		_inputs: any;
		_inputValues: any;
	};
	runningInEditor: boolean;
	setNodeFocused: () => any;
	styles: {
		graphModel: any;
		nodeRegister: any;
		styles: any;
		getNodeScope: any;
	};
	timerScheduler: { runningTimers: any; newTimers: any; requestFrame: any };
	updateIteration: number;
	variants: any;
	warningTypes: any;
	_dirtyNodes: any;
	_outputHistory: any;
	_signalHistory: any;
};

export type GraphModel = {
	componentIndex: any;
	componentToBundleMap: { size: number };
	components: { [x: string]: any };
	listeners: { [x: string]: any };
	listenersWithRefs: { [x: string]: any };
	metadata: {
		styles: { colors: { [x: string]: any }; text: { [x: string]: any } };
	};
	rootComponent: string;
	routerIndex: { routers: any; pages: any };
	settings: { navigationPathType: 'path' };
	variants: any;
	on(listener: string, callback: (node: GraphModelNode) => void): void;
};

export type GraphModelNode = {
	portDefsCache?: { inputs: PortDef[]; outputs: PortDef[] };
	firstRun: boolean;

	children: GraphModelNode[];
	component: any;
	id: string;
	inputPorts: any;
	inputs: any;
	listeners: { parameterUpdated: any };
	listenersWithRefs: {
		parameterUpdated: any;
		variantUpdated: any;
		inputPortRemoved: any;
		outputPortRemoved: any;
	};
	outputPorts: any;
	outputs: any;
	parameters: { [x: string]: any };
	parent: GraphModelNode;
	type: string;
	on(listener: string, callback: ({ name, state, value }) => void): void;
};

type ColorTypes = {
	purple: 'component';
	green: 'data';
	visual: 'blue';
	default: 'default';
	grey: 'default';
};
export type NodeColor = keyof ColorTypes | ColorTypes[keyof ColorTypes];
