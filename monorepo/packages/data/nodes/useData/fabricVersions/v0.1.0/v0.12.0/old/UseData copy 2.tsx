import { forwardRef } from "react"
import { createStore } from "jotai/vanilla";
import { useMolecule } from "bunshi/react";
import { useShallowEffect } from "@mantine/hooks";
import { useAtomValue, useSetAtom } from "jotai";
import DataProvider from "./DataProvider2";

export const jotaiStore = createStore()

export default forwardRef(function (props: CompProps12) {
  const { unique, flush } = window.R.libs.just

  const scopeId = Symbol()

  // initial
  useShallowEffect(() => {
    if (props.useDataScheme) {
      let dss: { [dbClass: string]: DataStore12 } = {}
      const orders = unique(flush(props.useDataScheme.map(i => i.order))).sort()
      // no queue
      if (orders.length <= 1) props.useDataScheme.forEach(scheme => dss[scheme.dbClass] = { scheme, enabled: true })
      // start queue
      else props.useDataScheme.forEach((scheme, idx) => dss[scheme.dbClass] = { scheme, enabled: idx === 0 ? true : false })
      //setDataStores(dss)
    }
  }, [props.useDataScheme])

  // fetched
  /* useShallowEffect(() => {
    if (fetchedState) {
      console.log('ef', fetchedState)
    }
  }, [fetchedState]) */

  return <div style={{ display: 'none' }}>
    {props.useDataScheme ? <DataProvider {...{ noodlNode: props.noodlNode, scopeId }} /> : <></>}
  </div>
})