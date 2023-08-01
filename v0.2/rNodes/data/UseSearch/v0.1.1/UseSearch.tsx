import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../../libs/useData/v0.2.0/useData'
import { useState } from 'react'

function UseSearch(props: any) {
  const { dbClasses, searchString, searchFields, options } = props
  const { isFetching, fetchStatus, data } = useData.search({ dbClasses, query: [{ searchString, fields: searchFields }], options })

  useShallowEffect(() => {
    if (fetchStatus === 'idle') {
      props.foundedData(data)
      props.sendLoaded()
    }
  }, [searchString, fetchStatus])

  useShallowEffect(() => {
    props.isLoading(isFetching)
  }, [isFetching])
  return <></>
}

export default function UseSearch_v0_1_1(props: any) {
  const { enabled } = props
  const [localEnabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (localEnabled) setEnabled(true)
  }, [localEnabled])
  return enabled ? <UseSearch {...props} /> : <></>
}