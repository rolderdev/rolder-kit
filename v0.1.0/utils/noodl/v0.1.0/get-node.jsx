import { cupFirstChar } from "../../formatters/v0.0.1/formatters"
import { reactNodes, nodes, portsDefinition } from "./nodes"
import { defineNode } from '@noodl/noodl-sdk'

export const getReactNode = (nodeName, version) => {
  const { allowChildren, versions } = reactNodes[nodeName]
  const ins = { ...portsDefinition(nodeName, version)?.ins, sx: { type: 'array', displayName: 'Custom sx', group: 'Advanced Style', tooltip: "Example: [{ width: 100 }]" } }
  const Comp = versions[version]

  return {
    name: 'rolder-kit.' + nodeName + '_v' + version,
    displayName: nodeName + ' v' + version,
    category: nodeName,
    allowChildren: allowChildren || false,
    inputProps: ins,
    outputProps: portsDefinition(nodeName, version)?.outs,
    dynamicports: portsDefinition(nodeName, version)?.dyn,
    getReactComponent() { return Comp }
  }
}

export const getNode = (nodeName, version) => {
  const { name, portsDefinition, nodeImport } = nodes[nodeName]

  return defineNode({
    name: 'rolder-kit.' + name + '_v' + version,
    displayName: cupFirstChar(name) + ' v' + version,
    category: cupFirstChar(name),
    inputs: portsDefinition(version)?.ins,
    outputs: portsDefinition(version)?.outs,
    dynamicports: portsDefinition(version)?.dyn,
    signals: {
      [cupFirstChar(name)]: function () {
        nodeImport(version).then((node) => node.default(this))
      }
    }
  })
}