import { isEmpty } from "lodash"
import { GraphModel, GraphModelNode, JsNodeDef, JsVersions, NodeColor, NodeContext } from "../../../types"
import { clearWarning, hasWarings, sendWarning } from "../funcs/warnings"
import getJsNodePorts from "./getJsNodePorts"
import typeOf from "just-typeof"

type Params = {
    color: NodeColor
    propsFunction?: boolean
}

export const jsNode = (nodeName: string, versions: JsVersions, params: Params) => {
    const nodeDef: JsNodeDef = {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName,
        color: params.color,
        initialize: function () {
            this.outputPropValues = {}
            // defaults on load
            this.scheduleAfterInputsHaveUpdated(() => {
                const version = this._internal.version
                const inputs = versions[version]?.inputs
                inputs?.filter(i => !isEmpty(i.default)).forEach(nodePort => {
                    this.setValue && this.setValue(nodePort.name, this._internal[nodePort.name])
                })
            })
        },
        methods: {
            // on inputs data change
            registerInputIfNeeded: function (inputName: any) {
                if (this.hasInput(inputName)) return
                this.registerInput(inputName, {
                    set: function (value: any) {
                        const version = this._internal.version
                        const inputs = versions[version]?.inputs
                        const nodePort = inputs?.find(i => i.name === inputName)

                        if (nodePort?.type === 'signal') {
                            // connection required
                            inputs?.filter(i => i.customs?.required && ['connection', 'both'].includes(i.customs?.required))
                                .forEach(nodePort => {
                                    const n = nodePort.name
                                    const dn = nodePort.displayName
                                    if (isEmpty(this._internal[n]))
                                        sendWarning(this.model, this.context, dn, `Empty input from connection: "${dn}"`)
                                    else clearWarning(this.model, this.context, dn)
                                })
                            // signal
                            if (!hasWarings(this) && value) {
                                const module = versions[version]?.module
                                const type: string = typeOf(module)
                                if (type === 'promise') module.then((s: any) => {
                                    if (s.default.signals[inputName]) s.default.signals[inputName](this, this._internal)
                                })
                                if (type === 'object' && module.signals[inputName]) module.signals[inputName](this, this._internal)
                            }
                        } else this.setValue(inputName, value)
                    }
                });
            },
            setValue(inputName: string, value: any) {
                const version = this._internal.version
                const inputs = versions[version]?.inputs
                const nodePort = inputs?.find(i => i.name === inputName)
                if (isEmpty(value)) {
                    // default
                    if (!isEmpty(nodePort?.default)) this._internal[inputName] = nodePort?.default
                    else delete this._internal[inputName]
                } else this._internal[inputName] = value
            },
            // on outputs data change
            registerOutputIfNeeded: function (name: any) {
                if (this.hasOutput(name)) return
                this.registerOutput(name, { getter: () => this.outputPropValues?.[name] });
            },
            /* 
            setInputsValue: function (inputName: string, inputValue: any) {
                const nodeInputs = versions[this._inputValues.version]?.inputs
                if (nodeInputs) { // skip without inputs and triggers after first load
                    const node = this as NoodlNode
                    // convert value and ceck type
                    const convertedValue = convertAndCheckType(node, nodeInputs, inputName, inputValue)
                    // save to internal storage to restore hided inputs
                    this._inputValues[inputName] = convertedValue
                    // set value and restore dependetns if needed
                    setValue(node, nodeInputs, inputName, convertedValue)
                    // set defaults if needed for any empty value                    
                    setDefaults(node, nodeInputs)
                    // check required input including dependents
                    checkRequired(node, nodeInputs)
                }
                const isSignal = nodeInputs?.some(i => i.type === 'signal' && i.name === inputName)
                if (!this.warnings?.count && this.loaded && !isSignal) {
                    const onInputChange = versions[this._inputValues.version]?.onInputChange
                    if (onInputChange) onInputChange(this)
                }
            } */
        },
        setup: function (context: NodeContext, graphModel: GraphModel) {
            if (!context.editorConnection || !context.editorConnection.isRunningLocally()) { return }

            graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
                const versionPort = {
                    name: 'version', displayName: 'Version*', group: 'Version', plug: 'input', required: true, index: 0,
                    type: {
                        name: 'enum', allowEditOnly: true, enums: Object.keys(versions).map(i =>
                            ({ value: i, label: i + (versions[i]?.hashTag ? ' #' + versions[i]?.hashTag : '') })
                        )
                    }
                }

                // on node add
                if (!node.parameters.version) sendWarning(node, context, 'Version', 'Choose version')
                context.editorConnection.sendDynamicPorts(node.id, [versionPort, ...getJsNodePorts(node, context, versions)])

                // on editor params update
                node.on('parameterUpdated', function () {
                    if (!node.parameters.version) {
                        context.editorConnection.clearWarnings(node.component.name, node.id)
                        sendWarning(node, context, 'Version', 'Choose version')
                    } else clearWarning(node, context, 'Version')
                    context.editorConnection.sendDynamicPorts(node.id, [versionPort, ...getJsNodePorts(node, context, versions)])
                })
            });
        }
    }
    return nodeDef
}