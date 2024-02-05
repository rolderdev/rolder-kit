import { NodePort } from "../../types";

export default [
    { name: 'useScope', displayName: 'Use scope', group: 'Scope', type: 'boolean', default: false },
    {
        name: 'formField', displayName: 'Form field', group: 'Form', type: 'string', customs: {
            required: 'both',
            dependsOn(p) { return p.useScope && p.scope === 'form' }
        }
    },
] as const satisfies readonly NodePort[]