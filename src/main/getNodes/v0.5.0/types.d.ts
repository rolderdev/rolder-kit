import { NodeScope, Proxy } from "@noodl/noodl-sdk";
import { NodePort } from "../../ports/v0.3.0/types";

export type CompVersions = {
    [key: string]: CompDefinition
}

export type CompDefinition = {
    Comp: any
    inputs?: NodePort[]
    outputs?: NodePort[]
    signals?: NodePort[]
}

export type JsVersions = {
    [key: string]: {
        signals: any
        inputs?: NodePort[]
        outputs?: NodePort[]
    }
}

export type NodeInstance = {
    nodeName: string
    resultInputs: { [key: string]: any }
    warnings: {
        count: number
        requiered: { [key: string]: string }
        types: { [key: string]: string }
    }
    innerReactComponentRef: any
    _inputValues: any
    outputPropValues: { [key: string]: any }
    _internal: any;
    id: string;
    context: any;
    model: any;
    nodeScope: NodeScope;
    numberedInputs: {};
    inputs: { [key: string]: any; };
    outputs: { [key: string]: any; };
    result: Proxy;
    clearWarnings(): void;
    sendWarning(name: string, message: string): void;
    setOutputs(o: { [key: string]: any }): void;
    registerInput(t: any, e: any): void;
    registerInputIfNeeded(name: string): void;
    deregisterInput(t: any): void;
    registerInputs(t: { [key: string]: any }): void;
    registerNumberedInput(t: any, e: any): void;
    getInput(name: string): { set: (n: any) => void; } | undefined;
    hasInput(name: string): boolean;
    setInputValue(t: any, e: any): void;
    registerOutput(name: string, e: {
        get?: () => any;
        getter: () => any;
        onFirstConnectionAdded?: () => void;
        onLastConnectionRemoved?: () => void;
    }): void;
    deregisterOutput(t: any): void;
    registerOutputs(t: { [key: string]: any }): void;
    hasOutput(t: any): boolean;
    getOutput(t: string): any;
    connectInput(t: any, e: any, n: any): void;
    removeInputConnection(t: any, e: any, n: any): void;
    isInputConnected(t: any): boolean;
    queueInput(t: any, e: any): void;
    /**
     * Dispatch code after the inputs have been updated.
     *
     * @param func
     */
    scheduleAfterInputsHaveUpdated(func: (this: any) => void): void;
    update(): void;
    sendValue(t: any, e: any): void;
    setNodeModel(t: any): void;
    addDeleteListener(t: any): void;
    flagDirty(): void;
    flagOutputDirty(name: string): void;
    sendSignalOnOutput(name: string): void;
};