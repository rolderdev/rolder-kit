import update from "../../../../libs/kuzzle/v.0.1.0/update"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ updating: true })
    update(noodleNode.inputs.updateItem)
        .then((response) => {
            noodleNode.setOutputs({ updating: false, updatedItem: response })
            noodleNode.sendSignalOnOutput('updated')
        })
}