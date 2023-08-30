import { defineReactNode, defineModule } from "@noodl/noodl-sdk"
import GridLoader from 'react-spinners/GridLoader'

function Comp(props) { return <GridLoader color={props.color} /> }

const nodeName = 'InitLoader'
const nodeVersion = 'v1'

const Node = defineReactNode({
    name: `rolder-kit.${nodeName}_${nodeVersion}`,
    displayName: `${nodeName} ${nodeVersion}`,
    noodlNodeAsProp: true,
    getReactComponent() {
        return Comp
    },
    initialize: function () { this.clearWarnings() },
    inputProps: {
        color: {
            group: 'Params',
            displayName: 'Color',
            type: 'color',
        },
    },
})

defineModule({ reactNodes: [Node] })