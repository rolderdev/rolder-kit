import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import type { Props } from "./types"
import React from "react"
import { getCompProps } from '@packages/get-comp-props'

const FormSelect = lazy(() => import("./src/formSelect"))
const ControlledSelect = lazy(() => import("./src/controlledSelect"))

export default forwardRef(function (props: Props, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        async select() {
            // нужно отправлять сигнал на 1 мс позже того как пришел selectedItem, т.к. разраб отправляет их одновременно
            await new Promise(r => setTimeout(r))
            selectRef.current?.select()
        },
        resetSelected() { selectRef.current?.resetSelected() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormSelect {...p} {...p.customProps} ref={selectRef} />
        : <ControlledSelect {...p} {...p.customProps} ref={selectRef} />
})
