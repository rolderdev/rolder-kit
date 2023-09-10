import { sendOutput, sendSignal } from "../../../../../utils/noodl/v0.1.0/send"
import updateUser from "../../../../../libs/kuzzle/updateUser/v0.1.0/updateUser"

type UserItem = {
    id: string
    body: any
    options?: any
}

const signals = {
    mUpdateUser: (noodlNode: NodeInstance) => {
        const { userItems }: { userItems: UserItem[] } = noodlNode._inputValues
        sendOutput({ noodlNode, portName: 'updating', value: true })
        Promise.all(userItems.map(i => updateUser(i.id, i.body, { refresh: 'wait_for' })))

        sendSignal({ noodlNode, portName: 'updated' })
        sendOutput({ noodlNode, portName: 'updating', value: false })
    }
}

export default signals