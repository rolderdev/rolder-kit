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
}

declare type CompVersions = {
    [key: string]: {
        Comp: any
        inputs?: NodePort[]
        outputs?: NodePort[]
        signals?: NodePort[]
    }
}