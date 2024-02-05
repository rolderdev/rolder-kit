import { NodePort } from "@shared/port"
import { GraphModelNode, JsVersions, NodeContext } from "../../types"
import { clearWarning, sendWarning } from "../funcs/warnings"
import { convertAndCheckProp } from "../funcs/convertAndCheckTypes"
import { setNodeParameterDefault } from "../funcs/defaults"
import { filterPortsByDependencies } from "../funcs/dependencies"
import { editorRequired } from "../funcs/required"
import { deleteOrphantNodeProps } from "../funcs/deleteOrphants"
import { editorValidate } from "../funcs/validate"

export default function (node: GraphModelNode, context: NodeContext, versions: JsVersions) {
    const versionPort = {
        name: 'version', displayName: 'Version*', group: 'Version', plug: 'input', required: true, index: 0,
        type: {
            name: 'enum', allowEditOnly: true, enums: Object.keys(versions).map(i =>
                ({ value: i, label: i + (versions[i]?.hashTag ? ' #' + versions[i]?.hashTag : '') })
            )
        }
    } as NodePort

    if (!node.parameters.version) {
        context.editorConnection.clearWarnings(node.component.name, node.id)
        sendWarning(node, context, 'Version', 'Choose version')
    } else clearWarning(node, context, 'Version')

    let resultNodePorts: NodePort[] = [versionPort]

    if (node.parameters?.version) {
        let nodeInputs = versions[node.parameters.version]?.inputs || []

        nodeInputs.forEach(nodeInput => {
            const n = nodeInput.name
            let p = node.parameters[n]

            p = setNodeParameterDefault(nodeInput, p)
            p = convertAndCheckProp(node, context, nodeInput, p)
            node.nodeProps[n] = p
        })

        const nodeOutputs = versions[node.parameters.version]?.outputs || []
        resultNodePorts = filterPortsByDependencies([...nodeInputs, ...nodeOutputs, versionPort], node.nodeProps)

        nodeInputs = resultNodePorts.filter(i => i.plug === 'input') || []
        node.nodeProps = deleteOrphantNodeProps(nodeInputs, node.nodeProps)

        editorRequired(node, context, nodeInputs)
        editorValidate(node, context, nodeInputs)
    }

    return resultNodePorts
}