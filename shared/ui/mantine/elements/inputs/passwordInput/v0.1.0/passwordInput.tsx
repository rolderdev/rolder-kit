import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from '@shared/get-comp-props'

const FormPasswordInput = lazy(() => import("./src/formPasswordInput"))
const ControlledPasswordInput = lazy(() => import("./src/controlledPasswordInput"))

export default forwardRef(function (props: Props, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { selectRef.current?.reset() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? null
        : <ControlledPasswordInput {...p} {...p.customProps} ref={selectRef} />
})