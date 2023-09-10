import { sendOutput, sendSignal } from "../../../../../utils/noodl/v0.1.0/send"
import updateUser from "../../../../../libs/kuzzle/updateUser/v0.1.0/updateUser"

type UserItem = {
    id: string
    body: any
    options?: any
}

const signals = {
    updateUser: (noodlNode: NodeInstance) => {
        const { userItem }: { userItem: UserItem } = noodlNode._inputValues
        sendOutput({ noodlNode, portName: 'updating', value: true })
        updateUser({ id: userItem.id, body: userItem.body, options: { refresh: 'wait_for' } })

        sendSignal({ noodlNode, portName: 'updated' })
        sendOutput({ noodlNode, portName: 'updating', value: false })
    }
}

export default signals