import { GroupName, PortName } from "./src/funcs/getPort"
import { ExpandedType, PortType } from "./src/funcs/getType"
import { RolderType } from '@rk/types'

export type NodePort = {
  index?: number
  plug?: 'input' | 'output'
  type: PortType
  name: string
  displayName: string
  group: 'Project' | 'Version' | 'Scope' | 'Data' | 'Signals' | 'Params' | 'Style' | 'Loader' | 'Layout' | 'Dimensions' | 'Placeholder'
  | 'Advanced'
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
  }
}

export type OutputName = 'colorScheme' | 'colorSchemeChanged'


declare global {
  interface Window {
    R: RolderType
  }
}