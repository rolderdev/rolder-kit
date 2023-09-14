import mUpdate from "../../../../../../libs/dataService/2_back/mutate/mUpdate/v0.2.0/mUpdate"
import { sendOutput, sendSignal } from "../../../../../../utils/noodl/send/v0.2.0/send"

const signals = {
    update: (noodlNode: NodeInstance) => {
        const { updateItems, optimistic }: { updateItems: CreateUpdateItems, optimistic: boolean } = noodlNode._inputValues
        sendOutput(noodlNode, 'updating', true)

        mUpdate(updateItems, optimistic).then(nItems => {
            sendOutput(noodlNode, 'updatedItems', nItems)
            sendSignal(noodlNode, 'updated')
            sendOutput(noodlNode, 'updating', false)
        })
    }
}

export default signals