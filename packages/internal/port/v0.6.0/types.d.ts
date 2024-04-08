import { PortName } from "./src/funcs/getPort"
import { ExpandedType, PortType } from "./src/funcs/getType"

export type NodePort = {
  index?: number
  plug?: 'input' | 'output'
  type: PortType
  name: string
  displayName: string
  group: string
  default?: string | boolean | number
  tooltip?: string
  customs?: {
    required?: 'editor' | 'connection' | 'both'
    dependsOn?(props: { [name: string]: any }): boolean
    isObject?: boolean
    mantineDefault?: {
      comp: string
      prop: string
    }
    projectDefaultKey?: 'dateFormat'
    addNodePorts?(value: any): NodePort[]
    validate?(props: { [name: string]: any }): string | boolean
  }
}

export type TypeName = '*' | 'string' | 'number' | 'boolean' | 'array' | 'signal' | 'proplist' | 'color' | 'object' | 'component'