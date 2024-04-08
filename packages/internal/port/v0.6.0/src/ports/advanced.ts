import { type NodePort } from "../../port";

export default [
    {
        name: 'customProps', displayName: 'Custom props', group: 'Advanced', plug: 'input', index: 1000,
        type: 'array', customs: { isObject: true }
    },
    {
        name: 'propsFunction', displayName: 'Props function', group: 'Advanced', plug: 'input', index: 1001,
        type: 'array', customs: { isObject: true }
    }
] as const satisfies readonly NodePort[]