import mCreate from "../../../../../libs/kuzzle/v.0.1.0/mCreate"

export default async function node(noodleNode: any) {
    noodleNode.setOutputs({ creating: true })
    mCreate(noodleNode.inputs.createItems)
        .then((response) => {
            noodleNode.setOutputs({ creating: false, createdItems: response })
            noodleNode.sendSignalOnOutput('created')
        })
}