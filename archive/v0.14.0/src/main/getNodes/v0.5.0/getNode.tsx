import { forwardRef } from 'react'
import { Color, defineNode, defineReactNode } from '@noodl/noodl-sdk'
import { CompVersions, JsVersions, NodeInstance } from './types'
import getNodePorts from './getNodePorts'
import setDefaults from './setDefaults'
import setValue from './setValue'
import checkRequired from './checkRequired'
import convertAndCheckType from './convertAndCheckType'
import getJsNodePorts from './getJsNodePorts'

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

export const getJsNode = ({ nodeName, nodeVersion, jsVersions, color }:
  { nodeName: string, nodeVersion: string, jsVersions: JsVersions, color: Color }) => {
  return defineNode({
    name: `rolder-kit.${nodeName}_${nodeVersion}`,
    displayName: `${nodeName} ${nodeVersion}`,
    color: color,
    // Stage 1
    initialize: function () {
      this.nodeName = nodeName
      this.resultInputs = {}
      this.warnings = { count: 0, requiered: {}, types: {} }
      this.outputPropValues = {}
    },
    changed: {
      version() {
        this.scheduleAfterInputsHaveUpdated(() => {
          // triggers last on load, dummy setInputsValue
          this.setInputsValue('firstLoad', true)
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
            if (nodePort?.type === 'signal' && value) jsVersions[this.inputs.version]?.signals.then((n: any) => n.default[name](this))
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
        }
      }
    },
    setup: function (context: any, graphModel: any) {
      if (!context.editorConnection || !context.editorConnection.isRunningLocally()) { return }
      // Stage 0
      // recreate ports on changes
      graphModel.on(`nodeAdded.rolder-kit.${nodeName}_${nodeVersion}`, function (node: any) {
        context.editorConnection.sendDynamicPorts(node.id, getJsNodePorts(node, jsVersions))
        node.on('parameterUpdated', function () { context.editorConnection.sendDynamicPorts(node.id, getJsNodePorts(node, jsVersions)) })
      });
    }
  })
}