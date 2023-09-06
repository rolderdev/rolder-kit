import { forwardRef } from 'react'
import { defineReactNode, defineNode } from '@noodl/noodl-sdk'

export const getReactNode = ({ nodeName, nodeVersion, Comps, compVersions }:
  { nodeName: string, nodeVersion: string, Comps: any, compVersions: CompVersions }) => {
  return defineReactNode({
    name: `rolder-kit.${nodeName}_${nodeVersion}`,
    displayName: `${nodeName} ${nodeVersion}`,
    noodlNodeAsProp: true,
    getReactComponent() {
      return forwardRef(Comps)
    },
    changed: {
      version() {
        // On first load
        // defaults        
        compVersions[this._inputValues.version]?.inputs?.forEach(inputDef => {
          if (!this._inputValues[inputDef.name]) this._inputValues[inputDef.name] = inputDef.default
        })
        // filter
        let inputs: { [key: string]: any } = { version: this._inputValues.version, noodlNode: this }
        Object.keys(this._inputValues).forEach(portName => {
          const inputDef = compVersions[this._inputValues.version]?.inputs?.find(i => i.name === portName)
          if (inputDef) {
            inputs[portName] = this._inputValues[portName]
            // Reset prop if dependsOn is false                    
            if (inputDef.dependsOn && !this._inputValues[inputDef.dependsOn]) inputs[portName] = undefined
          }
        })
        this.props = inputs

        // On version change. Will not trigger on first load 
        if (this.innerReactComponentRef) this.innerReactComponentRef.setComp(inputs, true)
      }
    },
    inputs: {
      version: {
        group: 'Version',
        displayName: 'Version',
        type: { name: 'enum', allowEditOnly: true, enums: Object.keys(compVersions).map(i => ({ value: i, label: i })) },
      },
    },
    methods: {
      // on inputs data change
      registerInputIfNeeded: function (name: any) {
        if (this.hasInput(name)) return
        this.registerInput(name, {
          set: function () {
            // Sets props of current version
            Object.keys(this._inputValues).forEach(portName => {
              const input = compVersions[this._inputValues.version]?.inputs?.find(i => i.name === portName)
              if (input) {
                // convert array string to array
                if (input.type === 'array' && this._inputValues[portName] && typeof this._inputValues[portName] === 'string')
                  // convert single object array to object
                  if (input.isObject) this.props[portName] = eval(this._inputValues[portName])[0]
                  else this.props[portName] = eval(this._inputValues[portName])
                else this.props[portName] = this._inputValues[portName]
                // convert proplist to array
                if (input.type === 'proplist' && this._inputValues[portName])
                  this.props[portName] = this._inputValues[portName].map((i: any) => i.label)
                // Reset prop if dependsOn is false
                const dependsOnName = input.dependsOn
                if (dependsOnName && !this._inputValues[dependsOnName]) this.props[portName] = undefined
              }
            })

            // On ports changes. Will not trigger on first load and version change
            if (this.innerReactComponentRef) this.innerReactComponentRef.setComp(this.props)

            // Signals definition this input and is true, means signal triggered
            if (compVersions[this._inputValues.version]?.signals?.map(i => i.name).includes(name)) {
              this.innerReactComponentRef?.[name]();
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
    setup: function (context: any, graphModel: any) {
      if (!context.editorConnection || !context.editorConnection.isRunningLocally()) {
        return;
      }
      // recreate ports when version changed
      graphModel.on(`nodeAdded.rolder-kit.${nodeName}_${nodeVersion}`, function (node: any) {

        function updatePorts() {
          let ports: any = []
          if (node.parameters?.version) {
            // inputs
            const allInputs = compVersions[node.parameters.version]?.inputs
            allInputs?.forEach(input => {
              if (input.dependsOn && node.parameters[input.dependsOn]) ports.push(input)
              else if (!input.dependsOn) ports.push(input)
            })
            // input signals
            if (compVersions[node.parameters.version]?.signals) ports = ports.concat(compVersions[node.parameters.version]?.signals)
            // output ports and signals                    
            if (compVersions[node.parameters.version]?.outputs) ports = ports.concat(compVersions[node.parameters.version]?.outputs)
          }
          context.editorConnection.sendDynamicPorts(node.id, ports)
        }

        updatePorts()
        node.on('parameterUpdated', function () { updatePorts() })
      });
    }
  })
}

export const getJsNodes = (nodeName: string, nodecompVersions: any) => {
  return Object.keys(nodecompVersions).map(nodeVersion => {
    const { nodeImport, inputs, outputs } = nodecompVersions[nodeVersion]

    return defineNode({
      name: `rolder-kit.${nodeName}_v${nodeVersion}`,
      displayName: `${nodeName} v${nodeVersion}`,
      inputs: inputs,
      outputs: outputs,
      initialize: function () { nodeImport.then((node: any) => node.default.initialize(this)) },
    })
  })
}