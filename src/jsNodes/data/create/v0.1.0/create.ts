import create from "../../../../libs/kuzzle/v.0.1.0/create"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ creating: true })
    create(noodleNode.inputs.createItem)
        .then((response) => {
            noodleNode.setOutputs({ creating: false, createdItem: response })
            noodleNode.sendSignalOnOutput('created')
        })
}