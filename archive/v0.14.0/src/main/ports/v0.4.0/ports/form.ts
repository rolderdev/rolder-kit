import { NodePort } from "../types";
import { enums } from "../enums";

const form = [
    { name: 'formScheme', group: 'Params', type: 'array', displayName: 'Form scheme', isObject: true, tooltip: "Example: {name: 'startDate', initialValue: new Date(), validate: isNotEmpty}" },
    { name: 'formHookAtForm', group: 'Form', type: 'object', displayName: 'Form hook' },
    { name: 'useForm', group: 'Form', type: 'boolean', displayName: 'Use form', default: false },
    { name: 'formField', group: 'Form', type: 'string', displayName: 'Form field', dependsOn: [{ name: 'useForm', value: true }] },
    { name: 'formHook', group: 'Form', type: 'object', displayName: 'Form hook', dependsOn: [{ name: 'useForm', value: true }] },
    { name: 'validationType', group: 'Form', type: { name: 'enum', enums: enums.validationTypes }, displayName: 'Validation type', default: 'onSubmit', dependsOn: [{ name: 'useForm', value: true }] },
    { name: 'debouncedValidation', group: 'Form', type: 'boolean', displayName: 'Debounced validation', default: true, dependsOn: [{ name: 'useForm', value: true }, { name: 'validationType', value: 'onChange' }], tooltip: 'Delay validation' },
    { name: 'validationDelay', group: 'Form', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: [{ name: 'validationType', value: 'onChange' }, { name: 'useForm', value: true }, { name: 'debouncedValidation', value: true }] },
] as const satisfies readonly NodePort[];

export default form