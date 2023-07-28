import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../libs/use-data/v0.1.0/use-data'
import { useState } from 'react'
import { setRefs } from '../../../utils/data/v.0.1.0/data'

function UseData(props) {
  const { useDataType, className, refMap } = props
  const { isLoading, data } = useData[useDataType](props)

  useShallowEffect(() => {
    if (data) {
      const noodlObjects = data[className].map(o => Noodl.Object.create(o))
      Noodl.Object.create({
        id: className,
        items: noodlObjects,
        count: data.totalCount,
        loaded: true
      })
      props.sendLoaded()
      if (props.setRefs) {
        setRefs(refMap[0])
      }
    }
  }, [data])
  useShallowEffect(() => {
    props.isLoading(isLoading)
  }, [isLoading])
  return <></>
}

export default function UseData_v0_1_1(props) {
  const { useDataEnabled, useDataType, className, setRefs, refMap } = props
  const [enabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (useDataEnabled && !className) console.warn('There is no className at ' + useDataType + ' node')
    if (setRefs && !refMap) console.warn('There is no refMap at ' + useDataType + ' node')
    else if (useDataEnabled) setEnabled(true)
  }, [useDataEnabled])
  return enabled ? <UseData {...props} /> : <></>
}