import mUpdate from "../../../../libs/kuzzle/v.0.1.0/mUpdate"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ updating: true })
    mUpdate(noodleNode.inputs.updateItems)
        .then((response) => {
            noodleNode.setOutputs({ updating: false, updatedItems: response })
            noodleNode.sendSignalOnOutput('updated')
        })
}