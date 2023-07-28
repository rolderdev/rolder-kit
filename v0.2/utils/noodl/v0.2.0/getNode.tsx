import { cupFirstChar } from '../../formatters/v0.1.0/formatters'
import { ReactElement } from 'react'
import reactNodes from './reactNodes'
import jsNodes from './jsNodes'
import { NodeDefinitionInstance, ReactNode, defineNode } from '@noodl/noodl-sdk'
import { Text } from '@mantine/core'

export const getReactNode = (nodeName: string, version: string): ReactNode => {
  const { Node, allowChildren, inputs, outputs, portRules } = reactNodes[nodeName][version]

  return {
    name: `rolder-kit.${nodeName}_v${version}`,
    displayName: `${nodeName} v${version}`,
    allowChildren: allowChildren || false,
    noodlNodeAsProp: true,
    inputProps: inputs,
    outputProps: outputs,
    dynamicports: portRules,
    getReactComponent() {
      return function (props: any): ReactElement {
        const { reqiereChildren, portsToCheck, inputs } = reactNodes[nodeName][version]

        if (reqiereChildren && !Array.isArray(props.children)) return <Text color='red'>{`Node ${nodeName} v${version} reqieres at least 2 children`}</Text>

        const emptyProps: string[] | undefined = portsToCheck?.filter(p => !props[p])
        if (emptyProps?.length) return <Text
          color='red'>{`Node ${nodeName} v${version} has empty reqiered inputs: ${emptyProps.map(e => inputs?.[e].displayName).join(', ')}`}
        </Text>

        return <Node {...props} />
      }
    }
  }
}

export const getJsNode = (nodeName: string, version: string): NodeDefinitionInstance => {
  const { nodeImport, inputs, outputs } = jsNodes[nodeName][version]

  return defineNode({
    name: `rolder-kit.${nodeName}_v${version}`,
    displayName: `${cupFirstChar(nodeName)} v${version}`,
    inputs: inputs,
    outputs: outputs,
    signals: {
      [cupFirstChar(nodeName)]: function () {
        nodeImport.then((node: any) => node.default(this))
      }
    }
  })
}