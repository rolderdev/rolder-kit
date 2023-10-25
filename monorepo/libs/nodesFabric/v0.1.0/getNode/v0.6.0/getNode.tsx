import { forwardRef, useImperativeHandle, useRef } from "react"
import getRNodePorts from "./utils/getRNodePorts"
import { useForceUpdate } from "@mantine/hooks"
import getResultProps from "./utils/getResultProps"
import convertAndCheckType from "./utils/convertAndCheckType"
import setValue from "./utils/setValue"
import setDefaults from "./utils/setDefaults"
import checkRequired from "./utils/checkRequired"
import getJsNodePorts from "./utils/getJsNodePorts"

export const getReactNode = (
    nodeName: string, compVersions: CompVersions, allowChildren?: boolean, color?: NodeColor, experimental?: boolean
): ReactNodeDef => {
    return {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName + (experimental ? ' #experimental' : ''),
        noodlNodeAsProp: true,
        allowChildren: allowChildren || false,
        color: color || 'blue',
        initialize: function () {
            this.resultProps = {}
            this.warnings = { count: 0, required: {}, types: {} }
            this.currentPorts = {}
        },
        getReactComponent() {
            return forwardRef(
                function (compProps: BaseProps, ref) {
                    const forceUpdate = useForceUpdate()
                    useImperativeHandle(ref, () => ({
                        forceUpdate() { forceUpdate() },
                        signal(name: string) { localRef.current?.[name]() }
                    }))

                    const localRef = useRef<any>(null)
                    const Comp = compVersions[compProps.version]?.Comp
                    const { compReady, resultProps } = getResultProps(compVersions, compProps)
                    return Comp && compReady ? <Comp {...resultProps} ref={localRef} /> : <></>
                }
            )
        },
        inputProps: {
            version: {
                group: 'Version',
                displayName: 'Version',
                type: { name: 'enum', allowEditOnly: true, enums: Object.keys(compVersions).map(i => ({ value: i, label: i })) },
            }
        },
        methods: {
            registerInputIfNeeded: function (name: any) {
                if (this.hasInput(name)) return
                this.registerInput(name, {
                    set: function (value: any) {
                        // trigger signal
                        if (compVersions[this._inputValues.version]?.signals?.map(i => i.name).includes(name)) {
                            this.innerReactComponentRef?.signal(name);
                        } else {
                            // sets props to compProps.noodlNode.props 
                            this.props[name] = value
                            // force update
                            this.innerReactComponentRef?.forceUpdate()
                        }
                    }
                });
            },
            // on outputs data change
            registerOutputIfNeeded: function (name: any) {
                if (this.hasOutput(name)) return
                this.registerOutput(name, { get() { return this.outputPropValues[name] }, });
            },
        },
        setup: function (context: NodeContext, graphModel: GraphModel) {
            if (!context.editorConnection || !context.editorConnection.isRunningLocally()) { return }

           /*  function addUseDataPort(compVersions: CompVersions, node: GraphModelNode, ports: NodePort[]) {
                const dbClassesPort = compVersions[node.parameters.version]?.inputs?.find(i => i.name === 'dbClasses')
                if (dbClassesPort) {
                    node.parameters.dbClasses?.forEach((props: any) => {
                        ports.push({ plug: 'output', name: props.label, group: 'Data', type: 'array', displayName: props.label })
                    })
                }
            } */

            graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
                let ports = getRNodePorts(node, compVersions)
                //addUseDataPort(compVersions, node, ports)
                context.editorConnection.sendDynamicPorts(node.id, ports)
                node.on('parameterUpdated', function () {
                    let ports = getRNodePorts(node, compVersions)
                    //addUseDataPort(compVersions, node, ports)
                    context.editorConnection.sendDynamicPorts(node.id, ports)
                })
            });
        }
    }
}

export const getJsNode = (nodeName: string, jsVersions: JsVersions, color: NodeColor, experimental: boolean) => {
    const nodeDef: JsNodeDef = {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName + (experimental ? ' #experimental' : ''),
        color: color,
        initialize: function () {
            this.nodeName = nodeName
            this.resultProps = {}
            this.warnings = { count: 0, required: {}, types: {} }
            this.outputPropValues = {}
            this.addDeleteListener(() => {
                const onDelete = jsVersions[this._inputValues?.version].onDelete
                if (onDelete) onDelete(this)
            })
        },
        changed: {
            version() {
                this.scheduleAfterInputsHaveUpdated(() => {
                    // triggers last on load, dummy setInputsValue to trigger on first load
                    this.loaded = true
                    if (this.setInputsValue) this.setInputsValue('loaded', true)
                })
            }
        },
        inputs: {
            version: {
                group: 'Version',
                displayName: 'Version',
                type: { name: 'enum', allowEditOnly: true, enums: Object.keys(jsVersions).map(i => ({ value: i, label: i })) },
            },
        },
        methods: {
            // Stage 2
            // on inputs data change
            registerInputIfNeeded: function (name: any) {
                if (this.hasInput(name)) return
                this.registerInput(name, {
                    set: function (value: any) {
                        this.setInputsValue(name, value)
                        const nodePort = jsVersions[this.inputs.version]?.inputs?.find(i => i.name === name)
                        if (nodePort?.type === 'signal' && value) jsVersions[this.inputs.version]?.signals[name](this)
                    }
                });
            },
            // on outputs data change
            registerOutputIfNeeded: function (name: any) {
                if (this.hasOutput(name)) return
                this.registerOutput(name, { getter: () => this.outputPropValues?.[name] });
            },
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
                    const onInputChange = jsVersions[this._inputValues.version].onInputChange
                    if (onInputChange) onInputChange(this)
                }
            }
        },
        setup: function (context: NodeContext, graphModel: GraphModel) {
            if (!context.editorConnection || !context.editorConnection.isRunningLocally()) { return }
            // recreate ports on changes
            graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
                context.editorConnection.sendDynamicPorts(node.id, getJsNodePorts(node, jsVersions))
                node.on('parameterUpdated', function () {
                    context.editorConnection.sendDynamicPorts(node.id, getJsNodePorts(node, jsVersions))
                })
            });
        }
    }
    return nodeDef
}