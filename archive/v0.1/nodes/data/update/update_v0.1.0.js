import update from '../../../libs/kuzzle/v0.0.6/update'

export default async function node(noodleNode) {
    noodleNode.setOutputs({ isUpdating: true })
    update(noodleNode.inputs.updateItem)
        .then(() => {
            noodleNode.setOutputs({ isUpdating: false })
            noodleNode.sendSignalOnOutput('sendUpdated')
        })
}