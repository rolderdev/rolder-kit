declare global {
    interface Window {
        Rolder: RolderType
        Noodl: any
        Kuzzle: Kuzzle
        QueryClient: any
        Clone: any;
        Dayjs: any;
        Mustache: any
        FilterBy: {
            values: Function
            dateRanfe: Function
        }
    }
}

declare type DbClass = {
    version: number,
    subscribe: boolean
    references: string[]
    defaultSort: {
        ['asc' | 'desc']: string
    },
    defaultOptions: {
        size: number
    }
}

declare type RolderType = {
    rolderKit: string
    inited: boolean
    authenticated?: boolean
    project: string
    projectVersion: string
    envVersion: string
    dbVersion: number
    dbClasses: {
        [key: string]: DbClass
    }
    debug: number
    sessionTimeout: string
    defaults: {
        dateFormat: string
    }
}

declare type JsNode = {
    [key: string]: {
        nodeImport: any
        inputs?: any
        outputs?: any
    }
}

declare type RNode = {
    [key: string]: {
        ReactComp: (props: any, ref: any) => JSX.Element
        allowChildren?: boolean
        reqiereChildren?: boolean
        inputs?: any
        outputs?: any
        inputsToCheck?: string[]
        inputRules?: InputRule[],
        signals?: {
            [key: string]: NodeSignal
        }
    }
}
declare type RNode2 = {
    [key: string]: {
        [key: string]: {
            ReactComp: (props: any, ref: any) => JSX.Element
            allowChildren?: boolean
            reqiereChildren?: boolean
            inputs?: {
                [key: string]: NodeInput
            }
            outputs?: any
            inputsToCheck?: string[]
            inputRules?: InputRule[],
            signals?: {
                [key: string]: NodeSignal
            }
        }
    }
}

declare type JsNodeProps = {
    [key: string]: NodeInput,
} | undefined

declare type InputRule = { condition: string, inputs: string[] }

declare type NoodlEnum = {
    label: string
    value: string
}

declare type Item = {
    id: string
    content: any
    states: any
    [key: string]: {
        id: string
        content: any
    },
    _kuzzle_info: {
        author: string
        createdAt: number
        updatedAt: number | null
        updater: number | null
    },
}

declare type NodePort = {
    plug?: string
    type: Type
    name: string
    displayName: string
    group: string
    default?: any
    tooltip?: string
    required?: boolean
    dependsOn?: string
    isObject?: boolean
}

declare type CompVersions = {
    [key: string]: {
        Comp: any
        inputs?: NodePort[]
        outputs?: NodePort[]
        signals?: NodePort[]
    }
}

type TypeEditor = 'javascript' | 'graphql' | 'html' | 'css'

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
        codeeditor?: TypeEditor;
        allowEditOnly?: boolean;
        allowConnectionsOnly?: boolean,
        enums?: NoodlEnum[],
        units?: string[],
        defaultUnit?: string
    }

type NodeInstance = {
    [x: string]: any;
    _internal: any;
    id: string;
    context: any;
    model: any;
    nodeScope: NodeScope;
    numberedInputs: {};

    inputs: {
        [key: string]: any;
    };

    outputs: {
        [key: string]: any;
    };

    result: Proxy;

    clearWarnings(): void;
    sendWarning(name: string, message: string): void;

    setOutputs(o: { [key: string]: any }): void;



    registerInput(t: any, e: any): void;
    registerInputIfNeeded(name: string): void;
    deregisterInput(t: any): void;

    registerInputs(t: { [key: string]: any }): void;
    registerNumberedInput(t: any, e: any): void;

    getInput(name: string): { set: (n: any) => void; } | undefined;
    hasInput(name: string): boolean;
    setInputValue(t: any, e: any): void;

    // TODO: Why do I have to add a getter? Can it use the default?
    registerOutput(name: string, e: {
        get?: () => any;
        getter: () => any;
        onFirstConnectionAdded?: () => void;
        onLastConnectionRemoved?: () => void;
    }): void;

    // TODO: This is not added in the core code
    //registerOutputIfNeeded(): void;
    deregisterOutput(t: any): void;

    registerOutputs(t: { [key: string]: any }): void;

    hasOutput(t: any): boolean;
    getOutput(t: string): any;

    connectInput(t: any, e: any, n: any): void;
    removeInputConnection(t: any, e: any, n: any): void;
    isInputConnected(t: any): boolean;
    queueInput(t: any, e: any): void;

    /**
     * Dispatch code after the inputs have been updated.
     *
     * @param func
     */
    scheduleAfterInputsHaveUpdated(func: (this: any) => void): void;

    update(): void;
    sendValue(t: any, e: any): void;
    setNodeModel(t: any): void;
    addDeleteListener(t: any): void;

    flagDirty(): void;
    flagOutputDirty(name: string): void;
    sendSignalOnOutput(name: string): void;
};