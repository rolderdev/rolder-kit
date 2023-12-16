import { useShallowEffect } from '@mantine/hooks'
import useData from '../../../../libs/useData/v0.3.0/useData'
import { useState } from 'react'
import { setRefs } from '../../../../utils/data/v0.3.0/data'
import { QueryClientProvider } from '@tanstack/react-query'

function UseData(props: any) {
  const { useDataType, dbClass } = props
  const { isLoading, isSuccess, data } = useData[useDataType](props)
  const Noodl = window.Noodl

  useShallowEffect(() => {
    if (isSuccess) {
      const noodlObjects = data.items?.map((o: any) => Noodl.Object.create(o))
      Noodl.Objects[dbClass].setAll({
        dbClass,
        items: noodlObjects,
        fetchedCount: data.fetched,
        totalCount: data.total
      })
      setRefs(dbClass)
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

export default function UseData_v0_2_0(props: { enabled: boolean; useDataType: string; dbClass: string; }) {
  const { enabled, dbClass } = props
  const [localEnabled, setEnabled] = useState(false)

  useShallowEffect(() => {
    if (enabled) {
      window.Noodl.Object.create({ id: dbClass })
      setEnabled(true)
    }
  }, [enabled])
  const queryClient = window.QueryClient
  return localEnabled ? (
    < QueryClientProvider client={queryClient} >
      <UseData {...props} />
    </QueryClientProvider >
  ) : <></>
}