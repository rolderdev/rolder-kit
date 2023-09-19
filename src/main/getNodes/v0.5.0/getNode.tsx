import { forwardRef } from 'react'
import { defineReactNode } from '@noodl/noodl-sdk'
import { CompVersions, NodeInstance } from './types'
import getNodePorts from './getNodePorts'
import setDefaults from './setDefaults'
import setValue from './setValue'
import checkRequired from './checkRequired'
import convertAndCheckType from './convertAndCheckType'

export const getReactNode = ({ nodeName, nodeVersion, CompsHandler, compVersions }:
  { nodeName: string, nodeVersion: string, CompsHandler: any, compVersions: CompVersions }) => {
  return defineReactNode({
    name: `rolder-kit.${nodeName}_${nodeVersion}`,
    displayName: `${nodeName} ${nodeVersion}`,
    getReactComponent() {
      return forwardRef(CompsHandler)
    },
    // Stage 1
    initialize: function () {
      this.nodeName = nodeName
      this.props.node = this
      this.nodeInited = false
      this.resultInputs = {}
      this.warnings = { count: 0, requiered: {}, types: {} }
    },
    changed: {
      version() {
        this.scheduleAfterInputsHaveUpdated(() => {
          // triggers last on load, dummy setInputsValue
          this.setInputsValue('firstLoad', true)
          this.updateComp()
          this.nodeInited = true
        })
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
      // Stage 2
      // on inputs data change
      registerInputIfNeeded: function (name: any) {
        if (this.hasInput(name)) return
        this.registerInput(name, {
          set: function (value: any) {
            this.setInputsValue(name, value)
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
      setInputsValue: function (inputName: string, inputValue: any) {
        const nodeInputs = compVersions[this._inputValues.version]?.inputs
        if (nodeInputs) { // skip without inputs and triggers after first load
          const node = this as NodeInstance
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
          // apply to component   
          if (this.nodeInited) this.updateComp()
        }

        /* console.groupCollapsed('=== Stage 3 resultInputs', inputName, inputValue)
        map(this.resultInputs, (k, v) => console.log(k, v))
        console.groupEnd() */
      },
      updateComp: function () {
        if (this.warnings.count === 0) this.compReady = true
        else this.compReady = false
        this.innerReactComponentRef?.forceUpdate()
      }
    },
    setup: function (context: any, graphModel: any) {
      if (!context.editorConnection || !context.editorConnection.isRunningLocally()) { return }
      // Stage 0
      // recreate ports on changes
      graphModel.on(`nodeAdded.rolder-kit.${nodeName}_${nodeVersion}`, function (node: any) {
        context.editorConnection.sendDynamicPorts(node.id, getNodePorts(node, compVersions))
        node.on('parameterUpdated', function () { context.editorConnection.sendDynamicPorts(node.id, getNodePorts(node, compVersions)) })
      });
    }
  })
}

/* type JsNodePops = {
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
        const inputsDef = jsVersions[version]?.inputs
        if (inputsDef) {
          inputsDef.forEach(inputsDef => {
            // defaults            
            //if (inputsDef.default) this._inputValues[inputsDef.name] = inputsDef.default
            //covertType(inputsDef, inputsDef.name, this._inputValues)
          })
        }
      }
    },
    methods: {
      // on inputs data change
      registerInputIfNeeded: function (name: any) {
        if (this.hasInput(name)) return
        this.registerInput(name, {
          set: function (value: any) {
            this._inputValues[name] = value
            const nodePort = jsVersions[this.inputs.version]?.inputs?.find(i => i.name === name)
            //if (nodePort) covertType(nodePort, name, this._inputValues)
            if (nodePort?.type === 'signal' && value) jsVersions[this.inputs.version]?.signals.then((n: any) => n.default[name](this))
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
} */