import { forwardRef, useRef, useState } from 'react'
import Fetch from './Fetch'
import { sendOutput, sendSignal } from '../../../../../main/ports/send/v0.3.0/send'

const Comp = forwardRef(function (props: any) {
  const localRef = useRef<any>(null)
  const { node, queryType } = props

  const [loadedSended, setLoadedSended] = useState(false)

  function send(data: QClass) {
    sendOutput(node, 'items', data.items)
    sendOutput(node, 'fetchedCount', data.fetchedCount)
    sendOutput(node, 'totalCount', data.totalCount)
    if (!loadedSended) {
      sendSignal(node, 'loaded')
      setLoadedSended(true)
    }
  }

  switch (queryType) {
    case 'fetch': return <Fetch ref={localRef} {...props} send={send} />; break
    default: return <></>
  }
})

export default Comp