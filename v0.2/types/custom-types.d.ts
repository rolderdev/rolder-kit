import { NodeInput, ReactNodeInput, Type } from "@noodl/noodl-sdk"
import { ReactElement } from "react"

type RNodeParams = {
    [key: string]: {
        Node: any,
        allowChildren?: boolean
        reqiereChildren?: boolean
        inputs?: RNodeProps,
        outputs?: RNodeProps,
        portRules?: PortRules,
        portsToCheck?: string[]
    }
}

type JsNodeParams = {
    [key: string]: {
        nodeImport: any,
        inputs?: JsNodeProps,
        outputs?: JsNodeProps
    }
}

declare type RNodes = {
    [key: string]: RNodeParams
}

declare type JsNodes = {
    [key: string]: JsNodeParams
}

declare type RNodeProps = {
    [key: string]: ReactNodeInput,
} | undefined

declare type JsNodeProps = {
    [key: string]: NodeInput,
} | undefined

declare type PortRules = { condition: string, inputs: string[] }[]

declare type NoodlEnum = {
    [key: string]: {
        label: string
        value: string
    }[]
}

declare type DbClass = {
    [key: string]: {
        version: number,
        subscribe: boolean
        defaultSort: {
            ['asc' | 'desc']: string
        },
        defaultOptions: {
            size: number
        }
    }
}

declare type RolderType = {
    inited: boolean
    project: string
    envVersion: string
    dbVersion: number
    dbClasses: {
        [key: string]: DbClass
    }
    debug: number
    sessionTimeout: string
}

declare global {
    interface Window {
        Rolder: RolderType
        Kuzzle: Kuzzle
        Clone: any;
        Dayjs: any;
        Ms: any;
        Noodl: any
        SetRefs: any
        QueryClient: any
    }
}

declare module 'ms' {
    var x: any;
    export = x;
}