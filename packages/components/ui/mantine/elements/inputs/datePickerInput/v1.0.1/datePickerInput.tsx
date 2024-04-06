import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import type { Props } from "./types"
import React from "react"
import { getCompProps } from '@packages/get-comp-props'

const FormDatePickerInput = lazy(() => import("./src/formDatePickerInput"))
const ControlledDatePickerInput = lazy(() => import("./src/controlledDatePickerInput"))

export function isEmpty(dateValue: any) {
    if (!dateValue) return true
    if (Array.isArray(dateValue)) {
        if (!dateValue.length) return true
        else if (dateValue.filter(i => i === null).length === 2) return true
    }
    return false
}

export default forwardRef(function (props: Props, ref) {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { localRef.current?.reset() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormDatePickerInput {...p} {...p.customProps} ref={localRef} />
        : <ControlledDatePickerInput {...p} {...p.customProps} ref={localRef} />
})