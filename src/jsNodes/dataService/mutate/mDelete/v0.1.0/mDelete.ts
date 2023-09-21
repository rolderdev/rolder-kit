import mDelete from "../../../../../libs/kuzzle/v.0.1.0/mDelete"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ deleting: true })
    mDelete(noodleNode.inputs.deleteItems)
        .then(() => {
            noodleNode.setOutputs({ deleting: false })
            noodleNode.sendSignalOnOutput('deleted')
        })
}