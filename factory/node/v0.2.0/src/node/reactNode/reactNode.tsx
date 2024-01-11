import { BaseReactProps, CompVersions, GraphModel, GraphModelNode, NodeContext, ReactNodeDef } from "../../../types"
import { clearWarning, hasWarings, sendWarning } from "../funcs/warnings"
import typeOf from "just-typeof"
import { Suspense, forwardRef, lazy, useImperativeHandle, useRef } from "react"
import { NodePort } from "@rk/port"
import getReactNodePorts from "./getReactNodePorts"
import getProps from "../funcs/getProps"

type Params = {
    allowChildren?: boolean
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
    return {
        name: `rolder-kit.${nodeName}`,
        displayName: nodeName,
        noodlNodeAsProp: true,
        allowChildren: params?.allowChildren || false,
        getReactComponent() {
            return forwardRef(
                function (props: BaseReactProps, ref) {
                    const localRef = useRef<any>(null)
                    useImperativeHandle(ref, () => ({ signal(name: string) { localRef.current?.[name]() } }))

                    const version = props.version
                    const module = !hasWarings(props.noodlNode) ? versions[version]?.module : null
                    const p = !hasWarings(props.noodlNode)
                        ? getProps(props.noodlNode.model, props.noodlNode.context, versions[version]?.inputs, props)
                        : {}
                    const Comp = !hasWarings(props.noodlNode) ? getModule(module) : null

                    return Comp?.lazy
                        ? <Suspense fallback={null}>
                            <Comp.module {...p} ref={localRef} />
                        </Suspense>
                        : Comp ? <Comp.module {...p} ref={localRef} /> : null
                }
            )
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

            graphModel.on(`nodeAdded.rolder-kit.${nodeName}`, function (node: GraphModelNode) {
                const versionPort = {
                    name: 'version', displayName: 'Version*', group: 'Version', plug: 'input', required: true, index: 0,
                    type: {
                        name: 'enum', allowEditOnly: true, enums: Object.keys(versions).map(i =>
                            ({ value: i, label: i + (versions[i]?.hashTag ? ' #' + versions[i]?.hashTag : '') })
                        )
                    }
                } as NodePort

                // on node add
                if (!node.parameters.version) sendWarning(node, context, 'Version', 'Choose version')
                context.editorConnection.sendDynamicPorts(node.id, [versionPort, ...getReactNodePorts(node, context, versions)])
                // on editor params update
                node.on('parameterUpdated', function () {
                    if (!node.parameters.version) {
                        context.editorConnection.clearWarnings(node.component.name, node.id)
                        sendWarning(node, context, 'Version', 'Choose version')
                    } else clearWarning(node, context, 'Version')
                    context.editorConnection.sendDynamicPorts(node.id, [versionPort, ...getReactNodePorts(node, context, versions)])
                })
            });
        }
    }
}
