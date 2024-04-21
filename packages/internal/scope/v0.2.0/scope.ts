
// exportируем наши созданные scope, чтобы можно было использовать их ещё где-нибудь, через import
export { 
    type TableSelectionScopeValues,
    type TableSelectionChildIdsByParentId,
    type TableSelectionByDBClass,
    type TableSelectionScopeInternal,
    selectionScopeStoreAtom,
    tableSelectionScopeAtom,
    tableSelectionChildIdsByParentIdAtom,
    tableSelectionClickItemIdAtom,
    tableselectionByDBClassAtom, 
    tableSelectionScopeInternalAtom, 
    tableHandlerAtom 
} from './src/table/tableSelectionScope'

export { TableFilterScope, TableMolecule, useTableFilterScope } from './src/table/tableFilterScope'
export { TableCellScope, TableCellMolecule, useTableCellScope } from './src/table/tableCellScope'
export { FormScope, FormMolecule, type FormValues, useFormScope } from './src/form/formScope'
export type Scope = 'form' | 'table'