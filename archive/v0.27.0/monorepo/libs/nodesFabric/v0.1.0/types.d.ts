declare type CompVersions = {
    [key: string]: CompDefinition
}

declare type CompDefinition = {
    Comp: any
    hashTag?: 'experimental' | 'deprecated'
    inputs?: NodePort[]
    outputs?: NodePort[]
    signals?: NodePort[]
}

declare type JsVersions = {
    [key: string]: {
        hashTag?: 'experimental' | 'deprecated'
        inputs?: NodePort[]
        outputs?: NodePort[]
        onInputChange?: any
        signals?: any
        onDelete?: any
    }
}

declare type NodePort = {
    index?: number
    plug?: 'input' | 'output'
    type: Type
    name: string
    displayName: string
    group: string
    default?: string | boolean | number
    tooltip?: string
    required?: boolean
    dependsOn?: readonly DependsOn[]
    isObject?: boolean
}

declare type DependsOn = {
    name: string
    value: boolean | string
}

declare type NoodlEnum = {
    label: string
    value: string
}

declare type Type =
    | '*'
    | 'object'
    | 'array'
    | 'string'
    | 'stringlist'
    | 'number'
    | 'boolean'
    | 'signal'
    | 'enum'
    | 'color'
    | 'image'
    | 'icon'
    | 'font'
    | 'textStyle'
    | 'component'
    | 'dimension'
    | 'source'
    | 'resizing'
    | 'variable'
    | 'curve'
    | 'query-filter'
    | 'query-sorting'
    | 'pages'
    | 'proplist'
    | {
        name: Type;
        codeeditor?: 'javascript' | 'graphql' | 'html' | 'css';
        allowEditOnly?: boolean;
        allowConnectionsOnly?: boolean,
        enums?: NoodlEnum[],
        units?: string[],
        defaultUnit?: string
    }

declare type ReactNodeDef = {
    name: string
    displayName: string
    noodlNodeAsProp: boolean
    allowChildren: boolean
    color?: NodeColor
    warnings?: {
        count: number
        required: { [x: key]: string }
        types: { [x: key]: string }
    }
    currentPorts?: NodePort[] | {}
    initialize(): void
    getReactComponent(): any
    inputProps: {
        version: {
            group: 'Version'
            displayName: 'Version'
            type: Type
        }
    }
    methods: { [key: string]: any }
    setup(context: any, graphModel: any): void
    resultProps?: { [key: string]: any }
    addDeleteListener?: any
}

declare type JsNodeDef = {
    name: string
    displayName: string
    color?: NodeColor
    nodeName?: string
    _inputValues?: any
    resultProps?: { [x: key]: string }
    outputPropValues?: { [x: key]: string }
    loaded?: boolean
    warnings?: {
        count: number
        required: { [x: key]: string }
        types: { [x: key]: string }
    }
    initialize(): void
    inputs: {
        version: {
            group: 'Version'
            displayName: 'Version'
            type: Type
        }
    }
    changed?: {
        [key: string]: (
            this: JsNodeDef,
            newValue: string,
            oldValue: string
        ) => void
    }
    scheduleAfterInputsHaveUpdated?: any
    setInputsValue?: (inputName: string, inputValue: any) => void
    signals?: {
        [key: string]: {
            displayName: string,
            signal: (this: NoodlNode) => void
        }
    }
    methods: { [key: string]: any }
    setup(context: any, graphModel: any): void
    addDeleteListener?: any
}

declare type NoodlNode = {
    resultProps: { [x: string]: any }
    dataStore: any
    warnings: {
        count: number
        required: { [x: string]: string }
        types: { [x: string]: string }
        context: string
    }
    hasOutput(name: string): boolean
    flagOutputDirty(name: string): boolean
    sendSignalOnOutput(name: string): void
    ///
    boundingBoxObserver: { isRunning: boolean, numBoundingBoxObservers: number, pollDelay: number, target: any, callback: () => any }
    cachedChildren: { $$typeof: Symbol<any>, key: string, props: any }
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
    reactComponent: { $$typeof: Symbol<any>, render: () => any }
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
}

declare type NodeContext = {
    callbacksAfterUpdate: any
    componentModels: { [x: key]: any }
    connectionPulsingCallbackScheduled: boolean
    connectionsToPulse: any
    connectionsToPulseChanged: boolean
    currentFrameTime: number
    debugInspectors: any
    debugInspectorsEnabled: boolean
    editorConnection: any
    eventEmitter: { _events: any, _eventsCount: number, _maxListeners: number }
    eventSenderEmitter: { _events: any, _eventsCount: number, _maxListeners: number }
    frameNumber: number
    globalValues: any
    globalsEventEmitter: { _events: any, _eventsCount: number, _maxListeners: number }
    graphModel: GraphModel
    isUpdating: boolean
    nodeRegister: { _constructors: any, context: any }
    onClosePopup: () => any
    onShowPopup: () => any
    platform: { webSocketOptions: any, requestUpdate: any, getCurrentTime: any, objectToString: any }
    rootComponent: { id: string, context: any, _dirty: boolean, _inputs: any, _inputValues: any }
    runningInEditor: boolean
    setNodeFocused: () => any
    styles: { graphModel: any, nodeRegister: aby, styles: ant, getNodeScope: any }
    timerScheduler: { runningTimers: any, newTimers: any, requestFrame: any }
    updateIteration: number
    variants: any
    warningTypes: any
    _dirtyNodes: any
    _outputHistory: any
    _signalHistory: any
}

declare type GraphModel = {
    componentIndex: any
    componentToBundleMap: { size: number }
    components: { [x: key]: any }
    listeners: { [x: key]: any }
    listenersWithRefs: { [x: key]: any }
    metadata: { styles: { colors: { [x: key]: any }, text: { [x: key]: any } } }
    rootComponent: string
    routerIndex: { routers: any, pages: any }
    settings: { navigationPathType: 'path' }
    variants: any
    on(listener: string, callback: (node: GraphModelNode) => void): void
}

declare type GraphModelNode = {
    children: GraphModelNode[]
    component: any
    id: string
    inputPorts: any
    inputs: any
    listeners: { parameterUpdated: any }
    listenersWithRefs: { parameterUpdated: any, variantUpdated: any, inputPortRemoved: any, outputPortRemoved: any }
    outputPorts: any
    outputs: any
    parameters: { version: 'v0.1.0', [x: string]: any }
    parent: GraphModelNode
    type: string
    on(listener: string, callback: ({ name: string, state: any, value: any }) => void): void
}

type ColorTypes = {
    purple: 'component'
    green: 'data'
    visual: 'blue'
    default: 'default'
    grey: 'default'
}
declare type NodeColor = keyof ColorTypes | ColorTypes[keyof ColorTypes]