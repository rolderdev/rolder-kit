import create from '../../../libs/kuzzle/v0.0.6/create'

export default async function node(noodleNode) {
    noodleNode.setOutputs({ isCreating: true })
    create(noodleNode.inputs.createItem)
        .then((response) => {
            noodleNode.setOutputs({ isCreating: false, createdItem: response })
            noodleNode.sendSignalOnOutput('sendCreated')
        })
}