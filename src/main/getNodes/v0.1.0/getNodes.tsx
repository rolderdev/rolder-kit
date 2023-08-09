import { defineNode } from '@noodl/noodl-sdk'
import { Text } from '@mantine/core'

export const getReactNodes = (nodeName: string, nodeVersions: any) => {
  return Object.keys(nodeVersions).map(nodeVersion => {
    const { ReactComp, allowChildren, inputs, outputs, inputRules } = nodeVersions[nodeVersion]

    return {
      name: `rolder-kit.${nodeName}_v${nodeVersion}`,
      displayName: `${nodeName} v${nodeVersion}`,
      allowChildren: allowChildren || false,
      inputProps: inputs,
      outputProps: outputs,
      dynamicports: inputRules,
      getReactComponent() {
        return function (props: any) {
          const { reqiereChildren, inputsToCheck, inputs } = nodeVersions[nodeVersion]

          if (reqiereChildren && !Array.isArray(props.children)) return <Text color='red'>{`Node ${nodeName} v${nodeVersion} reqieres at least 2 children`}</Text>

          const emptyProps: string[] | undefined = inputsToCheck?.filter((p: string) => !props[p])

          if (emptyProps?.length) return <Text
            color='red'>{`Node ${nodeName} v${nodeVersion} has empty reqiered inputs: ${emptyProps.map(e => inputs?.[e].displayName).join(', ')}`}
          </Text>

          return <ReactComp {...props} />
        }
      }
    }
  })
}

export const getJsNodes = (nodeName: string, nodeVersions: any) => {
  return Object.keys(nodeVersions).map(nodeVersion => {
    const { nodeImport, inputs, outputs } = nodeVersions[nodeVersion]

    return defineNode({
      name: `rolder-kit.${nodeName}_v${nodeVersion}`,
      displayName: `${nodeName} v${nodeVersion}`,
      inputs: inputs,
      outputs: outputs,
      signals: {
        [nodeName]: function () { nodeImport.then((node: any) => node.default(this)) }
      }
    })
  })
}