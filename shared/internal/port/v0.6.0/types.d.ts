import { PortName } from "./src/funcs/getPort"
import { ExpandedType, PortType } from "./src/funcs/getType"

export type NodePort = {
  index?: number
  plug?: 'input' | 'output'
  type: PortType
  name: string
  displayName: string
  group: GroupName
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

export type TypeName = '*' | 'string' | 'number' | 'boolean' | 'array' | 'signal' | 'proplist' | 'color' | 'object'
export type GroupName = 'Project' | 'Version' | 'Scope' | 'Data' | 'Signals' | 'Params' | 'Style' | 'Loader' | 'Layout' |
  'Dimensions' | 'Placeholder' | 'Advanced' | 'States' | 'Icon' | 'DB classes' | 'Query params' | 'References' |
  'Backward references' | 'Search' | 'Search fields' | 'Pagination' | 'Form' | 'Output DB classes*' | 'Fetch' | 'Mask params' |
  'Checkbox' | 'Margins' | 'Paddings' | 'Enablers' | 'Single selection' | 'Multi selection' | 'Sort' | 'Filter' | 'Expansion' |
  'Table styles' | 'Row styles' | 'Font' | 'Highlight' | 'Theme icon' | 'Scheme' | 'Network' | 'Columns' | 'Table style' |
  'Header style' | 'Row style' | 'Icons'
export type OutputName = 'colorScheme' | 'colorSchemeChanged' | 'items' | 'fetching' | 'fetched' | 'userRole' | 'signedIn' |
  'signedOut' | 'reseted' | 'typedValue' | 'aggregations' | 'fetchedPage' | 'fetchedItemsCount' | 'totalItemsCount' | 'width' |
  'height' | 'formHook' | 'submited' | 'screenshot' | 'screenshoted' | 'totalPages' | 'currentPage'