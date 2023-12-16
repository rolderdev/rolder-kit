import { PortRules } from "../custom-types"

declare module '@noodl/noodl-sdk' {
    // https://github.com/noodlapp/noodl-chartjs-module/blob/cbd69e526a8e68804f738c1deeb679b22d7df3ac/module/src/chart.js#L68-L72
    export type ReactNodeInput = {
        index?: number
        displayName?: string
        group?: string
        default?: any
        type:
        | Type
        | {
            // TODO: this is probably the same for everything? Just have extra props?
            name: string
            units?: string[]
            defaultUnit?: string
            enums?: {
                label: string
                value: string
            }[]
        },
        tooltip?: string
        transformTo?: (value: any) => any
    }

    /*     export type ReactNodeOutput = {
            type: Type
            displayName?: string
            group?: string
        } */

    export type ReactNodeInputCss = {
        index?: number
        group?: string
        displayName?: string
        type: Type
        default?: any
    }

    export type ReactNode = {
        name: string
        category?: string
        displayName: string

        /**
         * URL to the docs page.
         */
        docs?: string

        getReactComponent: () => any

        allowChildren?: boolean
        noodlNodeAsProp?: boolean

        initialize?: (this: NodeInstance & TDef) => void

        inputs?: {
            [key: string]: NodeInput
        }
        _inputValues?: {
            [key: string]: NodeInput
        }
        inputProps?: {
            [key: string]: ReactNodeInput
        }

        outputProps?: {
            [key: string]: ReactNodeInput
        }

        dynamicports?: PortRules

        changed?: {
            [key: string]: TSFixme
        }

        methods?: {
            [key: string]: TSFixme
        }

        inputCss?: any
        setup?: any

        frame?: {
            margins?: boolean
            position?: boolean
            align?: boolean
        }
        signals?: {
            [key: string]: NodeSignal
        }
    }

    //export type ReactNodeDefinition = {}
}