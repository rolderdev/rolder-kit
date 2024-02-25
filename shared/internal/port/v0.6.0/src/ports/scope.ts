import { NodePort } from "../../types";
import { getCustomEnumType } from "../funcs/getType";

export default [
    { name: 'useScope', displayName: 'Use scope', group: 'Scope', type: 'boolean', default: false },
    {
        name: 'formField', displayName: 'Form field', group: 'Form', type: 'string',
        customs: { required: 'both', dependsOn(p) { return p.useScope && p.scope === 'form' } }
    },
    {
        name: 'validationType', displayName: 'Validation type', group: 'Form',
        type: getCustomEnumType(['onSubmit', 'onChange', 'onBlur']), default: 'onSubmit',
        customs: { required: 'connection', dependsOn(p) { return p.useScope && p.scope === 'form' } }
    },
    {
        name: 'debouncedValidation', displayName: 'Debounced validation', group: 'Form', type: 'boolean', default: true,
        customs: {
            required: 'connection', dependsOn(p) { return p.useScope && p.scope === 'form' && p.validationType === 'onChange' }
        }
    },
    {
        name: 'validationDelay', displayName: 'Delay (ms)', group: 'Form', type: 'number', default: 350,
        customs: {
            required: 'both', dependsOn(p) {
                return p.useScope && p.scope === 'form' && p.validationType === 'onChange' && p.debouncedValidation === true
            }
        }
    },
] as const satisfies readonly NodePort[]