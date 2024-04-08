
// exportируем наши созданные scope, чтобы можно было использовать их ещё где-нибудь, через import
export { 
    tableSelectionScopeAtom,
    tableHandlerAtom
} from './src/table/tableSelectionScope'

export { TableFilterScope, TableMolecule, useTableFilterScope } from './src/table/tableFilterScope'
export { TableCellScope, TableCellMolecule, useTableCellScope } from './src/table/tableCellScope'
export { FormScope, FormMolecule, type FormValues, useFormScope } from './src/form/formScope'
export type Scope = 'form' | 'table'