import { enums } from "../enums";

const form = [
    { name: 'formScheme', group: 'Params', type: 'array', displayName: 'Form scheme', isObject: true, tooltip: "Example: {name: 'startDate', initialValue: new Date(), validate: isNotEmpty}" },
    { name: 'formHookAtForm', group: 'Form', type: 'object', displayName: 'Form hook' },
] as const satisfies readonly NodePort2[];

export default form