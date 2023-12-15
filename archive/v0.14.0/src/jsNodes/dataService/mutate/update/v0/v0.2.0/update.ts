import update from "../../../../../../libs/dataService/2_back/mutate/update/v0.4.0/update"
import { sendOutput, sendSignal } from "../../../../../../utils/noodl/send/v0.2.0/send"

const signals = {
  update: (noodlNode: NodeInstance) => {
    const { updateItem, optimistic }: { updateItem: CreateUpdateItem, optimistic: boolean } = noodlNode._inputValues
    sendOutput(noodlNode, 'updating', true)

    update(updateItem, optimistic).then(nItem => {
      sendOutput(noodlNode, 'updatedItem', nItem)
      sendSignal(noodlNode, 'updated')
      sendOutput(noodlNode, 'updating', false)
    })
  }
}

export default signals