import { GraphModel, GraphModelNode, JsDefinition, JsNodeDef, JsVersions, NodeColor, NodeContext } from "../../types"
import { hasWarings } from "../funcs/warnings"
import getJsNodePorts from "./getJsNodePorts"
import typeOf from "just-typeof"
import { NodePort } from "@shared/port"
import getProps from "../funcs/getProps"
import { setNodeParameterDefault } from "../funcs/defaults"
import { convertAndCheckProp } from "../funcs/convertAndCheckTypes"

type Params = {
    color?: NodeColor
}

function getModule(version: JsDefinition) {
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

export const jsNode = (nodeName: string, versions: JsVersions, params?: Params) => {
    return {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName,
        color: params?.color || 'green',
        initialize: function () { this.outputPropValues = {} },
        methods: {
            // on inputs data change
            registerInputIfNeeded: function (inputName: any) {
                if (this.hasInput(inputName)) return
                this.registerInput(inputName, {
                    set: function (value: any) {
                        const nodePort = versions[this._internal.version]?.inputs?.find(i => i.name === inputName)
                        if (nodePort?.type !== 'signal') this._internal[inputName] = value
                        else this.sendSignal(inputName, value)
                    }
                });
            },
            sendSignal(inputName: string, value: any) {
                const n = this as any
                const version = this._internal.version
                this._internal.noodlNode = this
                this._internal = version ? getProps(versions, this._internal) : {}

                // signal
                if (!hasWarings(n) && value) {
                    const module = getModule(versions[version])
                    const type: string = typeOf(module)
                    if (type === 'promise') module.then((s: any) => {
                        if (s.default[inputName]) s.default[inputName](this._internal)
                    })
                    if (type === 'object' && module[inputName]) module[inputName](this._internal)
                }
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
            function addNodePorts(versions: JsVersions, node: GraphModelNode, nodePorts: NodePort[]) {
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
                const nodePorts = getJsNodePorts(node, context, versions)
                context.editorConnection.sendDynamicPorts(node.id, addNodePorts(versions, node, nodePorts))

                node.on('parameterUpdated', function () {
                    const nodePorts = getJsNodePorts(node, context, versions)
                    context.editorConnection.sendDynamicPorts(node.id, addNodePorts(versions, node, nodePorts))
                })
            })
        }
    } as JsNodeDef
}