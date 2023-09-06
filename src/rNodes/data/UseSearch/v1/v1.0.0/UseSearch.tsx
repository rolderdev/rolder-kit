import { forwardRef } from 'react'
import { useShallowEffect } from '@mantine/hooks'
import useSearch from '../../../../../libs/dataService/useData/v1.0.0/useSearch/v1.0.0/useSearch'
import sendOutput from '../../../../../utils/noodl/v0.1.0/sendOutput'
import { setFoudedData } from '../../../../../utils/data/v0.3.0/data'

const Comp = forwardRef(function (props: any) {
  const { noodlNode, dbClasses, searchString, searchFields, options } = props
  const { isFetching, fetchStatus, data } = useSearch({ dbClasses, query: { searchString, fields: searchFields }, options })

  useShallowEffect(() => {
    if (fetchStatus === 'idle') {
      sendOutput({ noodlNode, portName: 'foundedData', value: setFoudedData(dbClasses, data) })
    }
  }, [searchString, fetchStatus])

  useShallowEffect(() => {
    sendOutput({ noodlNode, portName: 'searching', value: isFetching })
  }, [isFetching])
  return <></>
})

export default Comp