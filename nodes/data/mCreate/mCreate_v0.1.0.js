import mCreate from '../../../libs/kuzzle/v0.0.6/mCreate'

export default async function node(noodleNode) {
    noodleNode.setOutputs({ isCreating: true })
    mCreate(noodleNode.inputs.createData)
        .then((response) => {
            noodleNode.setOutputs({ isCreating: false, createdItems: response })
            noodleNode.sendSignalOnOutput('sendCreated')
        })
}