import { forwardRef, useRef, useState } from 'react'
import { sendOutput, sendSignal } from '../../../../../utils/noodl/send/v0.2.0/send'
import Fetch from './Fetch'

const Comp = forwardRef(function (props: any) {
  const localRef = useRef<any>(null)
  const { noodlNode, queryType } = props

  const [loadedSended, setLoadedSended] = useState(false)

  function send(data: QClass) {
    sendOutput(noodlNode, 'items', data.items)
    sendOutput(noodlNode, 'fetchedCount', data.fetchedCount)
    sendOutput(noodlNode, 'totalCount', data.totalCount)
    if (!loadedSended) {
      sendSignal(noodlNode, 'loaded')
      setLoadedSended(true)
    }
  }

  switch (queryType) {
    case 'fetch': return <Fetch ref={localRef} {...props} send={send} />; break
    default: return <></>
  }
})

export default Comp