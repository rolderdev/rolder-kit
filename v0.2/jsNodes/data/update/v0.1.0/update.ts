import update from "../../../../libs/kuzzle/v.0.1.0/update"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ updating: true })
    update(noodleNode.inputs.updateItem)
        .then(() => {
            noodleNode.setOutputs({ updating: false })
            noodleNode.sendSignalOnOutput('updated')
        })
}