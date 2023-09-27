import { forwardRef, useContext, useImperativeHandle, useRef } from "react"
import getRNodePorts from "./utils/getRNodePorts"
import { useForceUpdate } from "@mantine/hooks"
import getResultProps from "./utils/getResultProps"
import NodeContext from "../../../../NodeContext/v0.1.0/NodeContext"
import { changeWarnings } from "./utils/warnings"

export const getReactNode = (nodeName: string, compVersions: CompVersions, allowChildren: boolean, contextName?: string): ReactNodeDef => {
    return {
        name: `rolder-kit.${nodeName}`,
        displayName: `${nodeName}`,
        noodlNodeAsProp: true,
        allowChildren,
        initialize: function () {
            this.resultProps = {}
            this.warnings = { count: 0, required: {}, types: {} }
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
                    const ctx = useContext(NodeContext)
                    const hasContext = contextName && ctx.contextName === contextName
                    if (contextName && !hasContext) changeWarnings(compProps.noodlNode, 'context', contextName)
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
                if (['mounted', 'styleCss'].includes(name)) {
                    //console.log(this.innerReactComponentRef)
                }
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
            // Stage 0
            // recreate ports on changes
            graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
                context.editorConnection.sendDynamicPorts(node.id, getRNodePorts(node, compVersions))
                node.on('parameterUpdated', function () {
                    context.editorConnection.sendDynamicPorts(node.id, getRNodePorts(node, compVersions))
                })
            });
        }
    }
}