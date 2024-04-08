import {
    type BaseReactProps, type CompDefinition, type CompVersions, type GraphModel, type GraphModelNode, type NodeContext,
    type ReactNodeDef
} from "../../types"
import { hasWarings } from "../funcs/warnings"
import { Suspense, forwardRef, useImperativeHandle, useRef } from "react"
import getReactNodePorts from "./getReactNodePorts"
import React from "react"
import { type NodePort } from "@packages/port"
import getProps from "../funcs/getProps"
import { setNodeParameterDefault } from "../funcs/defaults"
import { convertAndCheckProp } from "../funcs/convertAndCheckTypes"

type Params = {
    allowChildren?: boolean
    loaderAnimation?: boolean
    docs?: string
}

function getModule(version: CompDefinition) {
    try {
        const module = version.module.dynamic || version.module.static
        if (module) return module
        else {
            log.error(`getModule error: no module found`, { version })
            return null
        }
    } catch (e) {
        log.error('Error at getModule', e)
        return null
    }
}

export const reactNode = (nodeName: string, versions: CompVersions, params?: Params): ReactNodeDef => {
    return {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName,
        docs: params?.docs,
        noodlNodeAsProp: true,
        allowChildren: params?.allowChildren || false,
        getReactComponent() {
            return forwardRef(function (props: BaseReactProps, ref) {
                const localRef = useRef<any>(null)
                useImperativeHandle(ref, () => ({ signal(name: string) { localRef.current?.[name]() } }))
                const version = props.version

                const p = version ? getProps(versions, props) : {}

                const Comp = !hasWarings(props.noodlNode) && version
                    ? getModule(versions[version])
                    : null

                return Comp
                    ? <Suspense fallback={
                        params?.loaderAnimation
                            ? <div style={{ padding: 24, margin: 'auto' }}>Loading...</div>
                            : null}
                    >
                        <Comp {...p} ref={localRef} />
                    </Suspense>
                    : null
            })
        },
        methods: {
            // on inputs data change
            registerInputIfNeeded: function (inputName: any) {
                if (this.hasInput(inputName)) return
                this.registerInput(inputName, {
                    set: function (value: any) {
                        const version = this._inputValues.version
                        const inputs = versions[version]?.inputs
                        const nodePort = inputs?.find(i => i.name === inputName)
                        if (nodePort?.type === 'signal') {
                            if (value === true) this.innerReactComponentRef?.signal(inputName)
                        } else {
                            this.props[inputName] = value
                            this.forceUpdate()
                        }
                    }
                });
            },
            // on outputs data change
            registerOutputIfNeeded: function (name: any) {
                if (this.hasOutput(name)) return
                this.registerOutput(name, { getter: () => this.outputPropValues?.[name] });
            },
        },
        setup: function (context: NodeContext, graphModel: GraphModel) {
            if (!context.editorConnection || !context.editorConnection.isRunningLocally()) { return }

            // add outputs from input value
            function addNodePorts(versions: CompVersions, node: GraphModelNode, nodePorts: NodePort[]) {
                try {
                    const nodeInputs = versions[node.parameters.version]?.inputs?.filter(i => i.customs?.addNodePorts)
                    let np = nodePorts
                    if (nodeInputs?.length) nodeInputs.forEach(nodeInput => {

                        const n = nodeInput.name
                        let p = node.parameters[n]
                        p = setNodeParameterDefault(nodeInput, p)
                        p = convertAndCheckProp(node, context, nodeInput, p)

                        if (nodeInput.customs?.addNodePorts) {
                            const func = nodeInput.customs?.addNodePorts
                            if (p) {
                                const outputPorts = func(p)
                                np = [...nodePorts, ...outputPorts]
                            }
                        }
                    })
                    return np
                } catch (e) { log.error('Add node ports error', e) }
            }

            graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
                if (!node.nodeProps) node.nodeProps = {}
                const nodePorts = getReactNodePorts(node, context, versions)
                context.editorConnection.sendDynamicPorts(node.id, addNodePorts(versions, node, nodePorts))

                node.on('parameterUpdated', function () {
                    const nodePorts = getReactNodePorts(node, context, versions)
                    context.editorConnection.sendDynamicPorts(node.id, addNodePorts(versions, node, nodePorts))
                })
            })
        }
    }
}