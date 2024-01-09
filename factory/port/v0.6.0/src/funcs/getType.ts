import getEnum from "./getEnum"

export type PortType = ExpandedType | '*' | 'string' | 'number' | 'boolean' | 'array' | 'signal' | 'proplist' | 'color'
export type ExpandedType = {
    name: string
    allowEditOnly?: boolean
    allowConnectionsOnly?: boolean
    enums?: readonly { value: string, label: string }[]
    units?: string[]
    defaultUnit?: Units
}
type Units = '%' | 'rem' | 'px'
export const defaultUnits = ['%', 'rem', 'px']

export function getEnumType(enums: ExpandedType['enums'], only?: 'editor' | 'connection') {
    let expandedType: ExpandedType = { name: 'enum', enums }
    if (only) {
        if (only === 'editor') expandedType.allowEditOnly = true
        else expandedType.allowConnectionsOnly = true
    }
    return expandedType
}

export function getCustomEnumType(values: string[], noCase?: boolean, only?: 'editor' | 'connection') {
    let expandedType: ExpandedType = { name: 'enum', enums: getEnum(values, noCase) }
    if (only) {
        if (only === 'editor') expandedType.allowEditOnly = true
        else expandedType.allowConnectionsOnly = true
    }
    return expandedType
}

export function getUnitType(units: string[], defaultUnit: Units, only?: 'editor' | 'connection') {
    let expandedType: ExpandedType = { name: 'number', units, defaultUnit }
    if (only) {
        if (only === 'editor') expandedType.allowEditOnly = true
        else expandedType.allowConnectionsOnly = true
    }
    return expandedType
}