import { isEmpty } from "lodash"
import { BaseReactProps, CompVersions, GraphModel, GraphModelNode, NodeContext, ReactNodeDef } from "../../../types"
import { clearWarning, hasWarings, sendWarning } from "../funcs/warnings"
import getJsNodePorts from "./getReactNodePorts"
import typeOf from "just-typeof"
import { Suspense, forwardRef, lazy, useImperativeHandle, useRef } from "react"

type Params = {
    allowChildren?: boolean
    propsFunction?: boolean
}

function getModule(module: any) {
    const type: string = typeOf(module)
    if (type === 'promise') return {
        lazy: true,
        module: lazy(() => module)
    }
    if (type === 'object') return {
        lazy: false,
        module
    }
}

export const reactNode = (nodeName: string, versions: CompVersions, params?: Params): ReactNodeDef => {
    console.log(nodeName, versions)
    return {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName,
        noodlNodeAsProp: true,
        allowChildren: params?.allowChildren || false,
        initialize: function () {
            // on load            
            this.scheduleAfterInputsHaveUpdated(() => {
                const version = this.props.version
                const inputs = versions[version]?.inputs
                // deafults
                inputs?.filter(i => !isEmpty(i.default)).forEach(nodePort => {
                    this.setValue && this.setValue(nodePort.name, this.props[nodePort.name])
                })
                // orphants
                Object.keys(this.props).forEach((propName: string) => {
                    if (!inputs?.map(i => i.name).includes(propName) && propName !== 'version') delete this.props[propName]
                })
            })
        },
        getReactComponent() {
            return forwardRef(
                function (props: BaseReactProps, ref) {
                    useImperativeHandle(ref, () => ({
                        signal(name: string) { localRef.current?.[name]() }
                    }))

                    const version = props.version

                    const localRef = useRef<any>(null)
                    const module = versions[version]?.module
                    console.log('hasWrning', nodeName, hasWarings(props.noodlNode))
                    const Comp = !hasWarings(props.noodlNode) ? getModule(module) : null
                    return Comp?.lazy
                        ? <Suspense fallback={null}>
                            <Comp.module {...props} ref={localRef} />
                        </Suspense>
                        : Comp ? <Comp.module {...props} ref={localRef} /> : null
                }
            )
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
                            /* inputs?.filter(i => i.customs?.required && ['connection', 'both'].includes(i.customs?.required))
                                .forEach(nodePort => {
                                    const n = nodePort.name
                                    const dn = nodePort.displayName
                                    if (isEmpty(this._internal[n]))
                                        sendWarning(this.model, this.context, dn, `Empty input from connection: "${dn}"`)
                                    else clearWarning(this.model, this.context, dn)
                                })
                            // signal
                            if (!getWarningsCount(this.context) && value) {
                                const module = versions[version]?.module
                                const type: string = typeOf(module)
                                if (type === 'promise') module.then((s: any) => {
                                    if (s.default.signals[inputName]) s.default.signals[inputName](this, this._internal)
                                })
                                if (type === 'object' && module.signals[inputName]) module.signals[inputName](this, this._internal)
                            } */
                        } else this.setValue(inputName, value)
                    }
                });
            },
            setValue(inputName: string, value: any) {
                const version = this.props.version
                const inputs = versions[version]?.inputs
                const nodePort = inputs?.find(i => i.name === inputName)
                if (isEmpty(value)) {
                    // default
                    if (!isEmpty(nodePort?.default)) this.props[inputName] = nodePort?.default
                    else delete this.props[inputName]
                } else this.props[inputName] = value
                this.forceUpdate()
            },
            // on outputs data change
            registerOutputIfNeeded: function (name: any) {
                if (this.hasOutput(name)) return
                this.registerOutput(name, { getter: () => this.outputPropValues?.[name] });
            },
            /* 
            setInputsValue: function (inputName: string, inputValue: any) {
                const nodeInputs = jsVersions[this._inputValues.version]?.inputs
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
                    const onInputChange = jsVersions[this._inputValues.version]?.onInputChange
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
}
