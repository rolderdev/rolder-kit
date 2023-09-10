import { forwardRef } from 'react'
import { defineReactNode, defineNode, Color } from '@noodl/noodl-sdk'
import typeOf from 'just-typeof'

function covertType(input: NodePort2, portName: string, values: any) {
  const value = values[portName]
  const typeOfValue: any = typeOf(value)
  // convert types
  if (value) {
    // convert array string to array                           
    if (input?.type === 'array' && typeOfValue === 'string') {
      // convert single object array to object
      if (input.isObject) values[portName] = eval(value)[0]
      else values[portName] = eval(value)
    }
    // convert proplist to array
    if (input?.type === 'proplist') values[portName] = value.map((i: any) => i.label)
  }
  // Reset prop if dependsOn is false    
  if (input.dependsOn && !values[input.dependsOn?.name]) values[portName] = undefined
}

export const getReactNode = ({ nodeName, nodeVersion, Comps, compVersions }:
  { nodeName: string, nodeVersion: string, Comps: any, compVersions: CompVersions2 }) => {
  return defineReactNode({
    name: `rolder-kit.${nodeName}_${nodeVersion}`,
    displayName: `${nodeName} ${nodeVersion}`,
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
        this.props = { noodlNode: this, ...this._inputValues }
        if (this.innerReactComponentRef) this.innerReactComponentRef.setComp(this._inputValues, true)
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
          set: function (value: any) {
            // Sets props of current version
            this._inputValues[name] = value
            const input = compVersions[this._inputValues.version]?.inputs?.find(i => i.name === name)
            if (input) {
              covertType(input, name, this._inputValues)
              this.props[name] = this._inputValues[name]
            }

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
              const dependsOnInput = allInputs.find(i => i.name === input.dependsOn?.name)
              if (input.name === 'dbClass') {
                input.type = {
                  name: 'enum',
                  enums: Object.keys(eval(window.Noodl.getProjectSettings().dbClasses)[0]).map(i => ({ value: i, label: i }))
                }
                ports.push(input)
              } else if (dependsOnInput && (node.parameters[dependsOnInput?.name] || dependsOnInput.default)) ports.push(input)
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

type JsNodePops = {
  nodeName: string
  nodeVersion: string
  jsVersions: JsVersions2
  color?: Color
}

export const getJsNode = ({ nodeName, nodeVersion, jsVersions, color }: JsNodePops) => {
  return defineNode({
    name: `rolder-kit.${nodeName}_${nodeVersion}`,
    displayName: `${nodeName} ${nodeVersion}`,
    color: color,
    inputs: {
      version: {
        group: 'Version',
        displayName: 'Version',
        type: { name: 'enum', allowEditOnly: true, enums: Object.keys(jsVersions).map(i => ({ value: i, label: i })) },
      },
    },
    initialize: function () { this.outputPropValues = {} },
    changed: {
      version(version: any) {
        Object.keys(this._inputValues).forEach(portName => {
          const input = jsVersions[version]?.inputs?.find(i => i.name === portName)
          if (input) covertType(input, portName, this._inputValues)
        })
      }
    },
    methods: {
      // on inputs data change
      registerInputIfNeeded: function (name: any) {
        if (this.hasInput(name)) return
        this.registerInput(name, {
          set: function (value: any) {
            this._inputValues[name] = value
            const input = jsVersions[this.inputs.version]?.inputs?.find(i => i.name === name)
            if (input) covertType(input, name, this._inputValues)
            if (input?.type === 'signal' && value) jsVersions[this.inputs.version]?.signals.then((n: any) => n.default[name](this))
          }
        });
      },
      // on outputs data change
      registerOutputIfNeeded: function (name: any) {
        if (this.hasOutput(name)) return
        this.registerOutput(name, { getter: () => this.outputPropValues?.[name] });
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
            const allInputs = jsVersions[node.parameters.version]?.inputs
            allInputs?.forEach(input => {
              const dependsOnInput = allInputs.find(i => i.name === input.dependsOn?.name)
              if (input.name === 'dbClass') {
                input.type = {
                  name: 'enum',
                  enums: Object.keys(eval(window.Noodl.getProjectSettings().dbClasses)[0]).map(i => ({ value: i, label: i }))
                }
                ports.push(input)
              } else if (dependsOnInput && (node.parameters[dependsOnInput?.name] || dependsOnInput.default)) ports.push(input)
              else if (!input.dependsOn) ports.push(input)
            })
            // input signals
            if (jsVersions[node.parameters.version]?.signals) ports = ports.concat(jsVersions[node.parameters.version]?.signals)
            // output ports and signals                    
            if (jsVersions[node.parameters.version]?.outputs) ports = ports.concat(jsVersions[node.parameters.version]?.outputs)
          }
          context.editorConnection.sendDynamicPorts(node.id, ports)
        }

        updatePorts()
        node.on('parameterUpdated', function () { updatePorts() })
      });
    },
  })
}