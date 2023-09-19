import createUser from "../../../../../libs/kuzzle/v.0.1.0/createUser"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ creating: true })
    createUser(noodleNode.inputs.createUserItem)
        .then((response) => {
            noodleNode.setOutputs({ creating: false, createdUserItem: response })
            noodleNode.sendSignalOnOutput('created')
        })
}