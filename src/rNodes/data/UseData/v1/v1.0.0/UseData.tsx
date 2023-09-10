import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { sendOutput, sendSignal } from '../../../../../utils/noodl/send/v0.2.0/send'
import { useDebouncedValue, usePrevious, useShallowEffect } from '@mantine/hooks'
import Search from './Search'
import Fetch from './Fetch'
import useData from '../../../../../libs/useData/v0.5.0/useData'

const Comp = forwardRef(function (props: any, ref) {
  const { Noodl } = window
  const localRef = useRef<any>(null)
  const { noodlNode, queryType, dbClass, searchString, searchDelay } = props

  // signals
  useImperativeHandle(ref, () => ({
    reload() { useData.invalidate(dbClass) }
  }), [])

  const [loadedSended, setLoadedSended] = useState(false)

  function send(data: NoodlDbClass) {
    sendOutput(noodlNode, 'items', data.items)
    sendOutput(noodlNode, 'fetchedCount', data.fetchedCount)
    sendOutput(noodlNode, 'totalCount', data.totalCount)
    if (!loadedSended) {
      sendSignal(noodlNode, 'loaded')
      setLoadedSended(true)
    }
  }

  const [debounced] = useDebouncedValue(searchString, searchDelay);
  const prevSearchString = usePrevious(debounced);

  //send changes to output on noodl db class changes
  useShallowEffect(() => Noodl.Objects[dbClass]?.on('change', (args: any) => { if (args.name === 'items') send(Noodl.Objects[dbClass]) }), [])

  switch (queryType) {
    case 'fetch': {
      if (debounced?.length > 1) return <Search {...props} debounced={debounced} />
      else if (!searchString) return <Fetch ref={localRef} {...props} prevSearchString={prevSearchString} />
    } break
    default: return <></>
  }
})

export default Comp