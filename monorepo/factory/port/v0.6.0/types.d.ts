import { GroupName, PortName } from "./src/funcs/getPort"
import { ExpandedType, PortType } from "./src/funcs/getType"

export type NodePort = {
    index?: number
    plug?: 'input' | 'output'
    type: PortType | ExpandedType
    name: string
    displayName: string
    group: 'Project' | 'Version' | 'Data' | 'Signals' | 'Params' | 'Style' | 'Loader' | 'Layout'
    default?: string | boolean | number
    tooltip?: string
    customs?: {
        required?: 'editor' | 'connection' | 'both'
        dependsOn?: readonly DependsOn[]
        isObject?: boolean
    }
}

export type DependsOn = {
    portName: PortName
    func(value: any): boolean
}

export type OutputName = 'colorScheme' | 'colorSchemeChanged'