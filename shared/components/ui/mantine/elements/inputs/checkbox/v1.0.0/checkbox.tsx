import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from '@shared/get-comp-props'

const FormCheckbox = lazy(() => import("./src/formCheckbox"))
const ControlledCheckbox = lazy(() => import("./src/controlledCheckbox"))

export default forwardRef(function (props: Props, ref) {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { localRef.current?.reset() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormCheckbox {...p} {...p.customProps} ref={localRef} />
        : <ControlledCheckbox {...p} {...p.customProps} ref={localRef} />
})