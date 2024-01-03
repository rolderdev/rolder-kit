import { GroupName } from "./funcs/getPort"
import { ExpandedType, PortType } from "./funcs/getType"

export type NodePort = {
    index?: number
    plug?: 'input' | 'output'
    type: PortType | ExpandedType
    name: string
    displayName: string
    group: GroupName
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
