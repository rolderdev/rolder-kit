import createUser from '../../../libs/kuzzle/v0.0.6/createUser'

export default async function node(noodleNode) {
    noodleNode.setOutputs({ isCreating: true })
    createUser(noodleNode.inputs.createUser)
        .then((response) => {
            noodleNode.setOutputs({ isCreating: false, createdUser: response })
            noodleNode.sendSignalOnOutput('sendCreated')
        })
}