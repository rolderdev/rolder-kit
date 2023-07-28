import mDelete from "../../../libs/kuzzle/v0.0.6/m-delete"

export default async function node(noodleNode) {
    noodleNode.setOutputs({ isDeleting: true })
    mDelete({ className: noodleNode.inputs.className, ids: noodleNode.inputs.ids })
        .then(() => {
            noodleNode.setOutputs({ isDeleting: false })
            noodleNode.sendSignalOnOutput('sendDeleted')
        })
}