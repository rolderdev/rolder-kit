import { forwardRef } from "react"
import { ScopeProvider } from "bunshi/react";
import { UseDataScope } from "./molecules";
import DataProvider from "./DataProvider";

export default forwardRef(function (props: CompProps12) {
  const { noodlNode, useDataScheme } = props
  const scopeId = Symbol()

  const ScopeProps = { scopeId, useDataScheme }

  return <div style={{ display: 'none' }}>
    {props.useDataScheme
      ? <ScopeProvider scope={UseDataScope} value={ScopeProps}>
        <DataProvider noodlNode={noodlNode} />
      </ScopeProvider>
      : <></>}
  </div>
})