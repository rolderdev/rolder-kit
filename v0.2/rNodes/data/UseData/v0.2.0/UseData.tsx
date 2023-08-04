import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../../libs/useData/v0.2.0/useData'
import { useState } from 'react'

function UseData(props: any) {
  const { useDataType, dbClass } = props
  const { isLoading, isSuccess, data } = useData[useDataType](props)
  const Noodl = window.Noodl

  useShallowEffect(() => {
    if (isSuccess) {
      const noodlObjects = data[dbClass].map((o: any) => Noodl.Object.create(o))
      Noodl.Objects[dbClass].setAll({
        items: noodlObjects,
        count: data.totalCount,
      })
      window.SetRefs(dbClass)
      props.loaded()
      props.loading(false)
    }
  }, [data])

  useShallowEffect(() => {
    Noodl.Objects[dbClass].set('loading', isLoading)
    props.loading(isLoading)
  }, [isLoading])

  return <></>
}

export default function UseData_v0_2_0(props: { enabled: boolean; useDataType: string; dbClass: string; setRefs: boolean; refMap: any }) {
  const { enabled, dbClass } = props
  const [localEnabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (enabled) {
      window.Noodl.Object.create({ id: dbClass })
      setEnabled(true)
    }
  }, [enabled])
  return localEnabled ? <UseData {...props} /> : <></>
}