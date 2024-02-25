import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from '@shared/get-comp-props'

const FormTextarea = lazy(() => import("./src/formTextarea"))
const ControlledTextarea = lazy(() => import("./src/controlledTextarea"))

export default forwardRef(function (props: Props, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({ reset() { selectRef.current?.reset() } }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormTextarea {...p} {...p.customProps} ref={selectRef} />
        : <ControlledTextarea {...p} {...p.customProps} ref={selectRef} />
})