import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../../libs/useData/v0.2.0/useData'
import { useState } from 'react'

function UseSearch(props: any) {
  const { dbClasses, searchString, searchFields, options } = props
  const { isFetching, fetchStatus, data } = useData.search({ dbClasses, query: [{ searchString, fields: searchFields }], options })

  useShallowEffect(() => {
    if (fetchStatus === 'idle') {
      props.foundedData(data)
      props.loaded()
    }
  }, [searchString, fetchStatus])

  useShallowEffect(() => {
    props.loading(isFetching)
  }, [isFetching])
  return <></>
}

export default function UseSearch_v0_1_1(props: any) {
  const { searchString } = props
  const [enabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (searchString?.length) setEnabled(true)
  }, [searchString])
  return enabled ? <UseSearch {...props} /> : <></>
}