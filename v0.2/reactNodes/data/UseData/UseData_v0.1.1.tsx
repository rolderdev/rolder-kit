import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../libs/useData/v0.2.0/useData'
import { useState } from 'react'
import { setRefs } from '../../../utils/data/v.0.1.0/data'

function UseData(props: any) {
  const Noodl = window.Noodl

  const { useDataType, dbClass, refMap } = props
  const { isLoading, data } = useData[useDataType](props)

  useShallowEffect(() => {
    if (data) {
      const noodlObjects = data[dbClass].map((o: any) => Noodl.Object.create(o))
      Noodl.Object.create({
        id: dbClass,
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

export default function UseData_v0_1_1(props: any) {
  const { useDataEnabled, useDataType, dbClass, setRefs, refMap } = props
  const [enabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (useDataEnabled && !dbClass) console.warn('There is no dbClass at ' + useDataType + ' node')
    if (setRefs && !refMap) console.warn('There is no refMap at ' + useDataType + ' node')
    else if (useDataEnabled) setEnabled(true)
  }, [useDataEnabled])
  return enabled ? <UseData {...props} /> : <></>
}