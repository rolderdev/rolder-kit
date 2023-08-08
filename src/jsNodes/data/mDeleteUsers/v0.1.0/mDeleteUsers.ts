import mDeleteUsers from "../../../../libs/kuzzle/v.0.1.0/mDeleteUsers"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ deleting: true })
    mDeleteUsers(noodleNode.inputs.deleteUserIds)
        .then(() => {
            noodleNode.setOutputs({ deleting: false })
            noodleNode.sendSignalOnOutput('deleted')
        })
}