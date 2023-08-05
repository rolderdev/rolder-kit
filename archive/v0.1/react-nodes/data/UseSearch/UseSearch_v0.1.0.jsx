import { useShallowEffect, useDebouncedValue } from '@mantine/hooks'
import useData from '../../../libs/use-data/v0.1.0/use-data'
import { useState } from 'react'

function UseSearch(props) {
  const { classNames, debounced, searchFields, options } = props
  const { isFetching, fetchStatus, data } = useData.search({ classNames, query: [{ searchString: debounced, fields: searchFields }], options })

  useShallowEffect(() => {
    if (fetchStatus === 'idle') {
      props.foundedData(data)
      props.sendLoaded()
    }
  }, [debounced, fetchStatus])

  useShallowEffect(() => {
    props.isLoading(isFetching)
  }, [isFetching])
  return <></>
}

export default function UseSearch_v0_1_0(props) {
  const { classNames, searchString } = props
  const [enabled, setEnabled] = useState(false)
  const [value, setValue] = useState('')
  const [debounced] = useDebouncedValue(value, 350)

  useShallowEffect(() => {
    if (!classNames) console.warn('There is no classNames at search node')
    else if (searchString?.length > 0) setValue(searchString)
  }, [searchString])

  useShallowEffect(() => {
    if (debounced?.length > 0) {
      props.debounced = debounced
      setEnabled(true)
    }
  }, [debounced])
  return enabled ? <UseSearch {...props} /> : <></>
}