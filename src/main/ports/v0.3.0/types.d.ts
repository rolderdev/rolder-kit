export type NodePort = {
    plug?: 'input' | 'output'
    type: Type
    name: string
    displayName: string
    group: string
    default?: string | boolean | number
    tooltip?: string
    required?: boolean
    dependsOn?: DependsOn | readonly DependsOn[]
    isObject?: boolean
}

export type DependsOn = {
    name: string
    value: boolean | string
}