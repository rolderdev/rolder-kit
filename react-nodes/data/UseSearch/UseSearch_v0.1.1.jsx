import { useShallowEffect, useDebouncedValue } from '@mantine/hooks'
import useData from '../../../libs/use-data/v0.1.0/use-data'
import { useState } from 'react'

function UseSearch(props) {
  const { classNames, searchString, searchFields, options } = props
  const { isFetching, fetchStatus, data } = useData.search({ classNames, query: [{ searchString, fields: searchFields }], options })

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

export default function UseSearch_v0_1_1(props) {
  const { classNames, searchFields, searchString } = props
  const [enabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (!classNames || !searchFields) console.warn('There is no classNames or searchFields at search node')
    else if (searchString?.length > 0) setEnabled(true)
    else setEnabled(false)
  }, [searchString])

  return enabled ? <UseSearch {...props} /> : <></>
}