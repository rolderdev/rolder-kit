import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../../libs/useData/v0.2.0/useData'
import { useState } from 'react'

function UseData(props: any) {
  const { useDataType, dbClass, refMap } = props
  const { isLoading, isSuccess, data } = useData[useDataType](props)
  const Noodl = window.Noodl

  useShallowEffect(() => {
    if (isSuccess) {
      const noodlObjects = data[dbClass].map((o: any) => Noodl.Object.create(o))
      Noodl.Objects[dbClass].setAll({
        items: noodlObjects,
        count: data.totalCount,
      })
      if (props.setRefs) {
        window.SetRefs(refMap[0])
      }
      props.loaded()
      props.loading(false)
    }
  }, [isSuccess])

  useShallowEffect(() => {
    Noodl.Objects[dbClass].set('loading', isLoading)
    props.loading(isLoading)
  }, [isLoading])

  return <></>
}

export default function UseData_v0_2_0(props: { enabled: boolean; useDataType: string; dbClass: string; setRefs: boolean; refMap: any }) {
  const { enabled, useDataType, dbClass, setRefs, refMap } = props
  const [localEnabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (setRefs && !refMap) console.warn('There is no refMap at ' + useDataType + ' node')
    else if (enabled) {
      window.Noodl.Object.create({ id: dbClass })
      setEnabled(true)
    }
  }, [enabled])
  return localEnabled ? <UseData {...props} /> : <></>
}