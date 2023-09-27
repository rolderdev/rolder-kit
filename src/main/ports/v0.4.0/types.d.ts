declare type NodePort = {
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