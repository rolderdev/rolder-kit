export type { NoodlNode, JsVersions, CompVersions, BaseJsProps, BaseReactProps } from "./types"
export { jsNode } from "./src/node/jsNode/jsNode"
export { reactNode } from "./src/node/reactNode/reactNode"
export { sendOutput, sendSignal } from "./src/send"
export { getCompProps } from './src/getCompProps'