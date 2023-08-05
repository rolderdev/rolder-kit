import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../libs/useData/v0.1.1/useData'
import { useState } from 'react'
import { setRefs } from '../../../utils/data/v.0.1.0/data'

function UseData(props) {
  const { useDataType, dbClass, refMap } = props
  const { isLoading, data } = useData[useDataType](props)

  useShallowEffect(() => {
    if (data) {
      const noodlObjects = data[dbClass].map(o => Noodl.Object.create(o))
      Noodl.Object.create({
        id: dbClass,
        items: noodlObjects,
        count: data.totalCount,
        isLoading: false
      })
      props.sendLoaded()
      props.isLoading(false)
      if (props.setRefs) {
        setRefs(refMap[0])
      }
    } else {
      Noodl.Object.create({
        id: dbClass,
        isLoading: true
      })
      props.isLoading(false)
    }
  }, [data])
  useShallowEffect(() => {
    props.isLoading(isLoading)
  }, [isLoading])
  return <></>
}

export default function UseData_v0_2_0(props) {
  const { useDataEnabled, useDataType, setRefs, refMap } = props
  const [enabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (setRefs && !refMap) console.warn('There is no refMap at ' + useDataType + ' node')
    else if (useDataEnabled) setEnabled(true)
  }, [useDataEnabled])
  return enabled ? <UseData {...props} /> : <></>
}