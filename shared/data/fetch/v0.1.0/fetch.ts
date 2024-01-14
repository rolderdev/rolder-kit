import { Props } from "./types"
import kuzzleFetch from '@shared/kuzzle-fetch'
import { sendOutput, sendSignal } from '@shared/port-send'
import { NoodlNode } from '@shared/node'

export default {
    fetch(noodlNode: NoodlNode, props: Props) {

        sendOutput(noodlNode, 'fetching', true)
        kuzzleFetch(props).then(rItems => {
            sendOutput(noodlNode, 'items', rItems)
            sendOutput(noodlNode, 'fetching', false)
            sendSignal(noodlNode, 'fetched')
        })
    }
}