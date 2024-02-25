import { NodePort } from "../../port";
import { getCustomEnumType, getEnumType, getType } from '../funcs/getType';

[{ value: 'item', label: 'Item' }, { value: 'value', label: 'Value' }]

export default [
    { name: 'items', displayName: 'Items', group: 'Data', type: 'array' },
    { name: 'src', displayName: 'Source', group: 'Data', type: 'string' },
    { name: 'typedValue', displayName: 'Typed value', group: 'Data', type: 'string' },
    { name: 'blob', displayName: 'Blob', group: 'Data', type: '*' },
    {
        name: 'newValue', group: 'Data', type: 'string', displayName: 'New value', customs: {
            dependsOn(p) { return p.creatable ? true : false },
        }
    },
    { name: 'selectedItem', displayName: 'Selected item', group: 'Data', type: 'object' },
    { name: 'inputItems', displayName: 'Items', group: 'Data', type: 'array' },
    {
        name: 'defaultItem', displayName: 'Default item', group: 'Data', type: getType('object', 'connection'),
        customs: { dependsOn(p) { return p.useScope ? false : true }, }
    },
    {
        name: 'defaultDate', displayName: 'Default date', group: 'Data', type: getType('*', 'connection'),
        customs: { dependsOn(p) { return p.useScope ? false : true }, }
    },
    { name: 'selectedDate', displayName: 'Selected date', group: 'Data', type: '*' },
    {
        name: 'defaultItems', displayName: 'Default items', group: 'Data', type: 'array',
        customs: { dependsOn(p) { return p.useScope ? false : true }, }
    },
    { name: 'selectedItems', displayName: 'Selected items', group: 'Data', type: 'array' },
    {
        name: 'dataSource', group: 'Data', type: getCustomEnumType(['item', 'value']), displayName: 'Data source',
        default: 'item', customs: { required: 'both' }
    },
    {
        name: 'itemSource', group: 'Data', type: getType('*', 'connection'), displayName: 'Item',
        customs: { dependsOn(p) { return p.dataSource === 'item' } }
    },
    {
        name: 'sourceField', group: 'Data', type: 'string', displayName: 'Field',
        customs: { dependsOn(p) { return p.dataSource === 'item' } }
    },
    {
        name: 'valueSource', group: 'Data', type: 'string', displayName: 'Value',
        customs: { dependsOn(p) { return p.dataSource === 'value' } }
    },
] as const satisfies readonly NodePort[]