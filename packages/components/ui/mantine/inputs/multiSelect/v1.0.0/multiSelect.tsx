import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import type { Props } from "./types"
import { getCompProps } from '@packages/get-comp-props'

const FormMultiSelect = lazy(() => import("./src/formMultiSelect"))
const ControlledMultiSelect = lazy(() => import("./src/controlledMultiSelect"))

export default forwardRef(function (props: Props, ref) {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        resetSelected() { localRef.current?.resetSelected() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormMultiSelect {...p} {...p.customProps} ref={localRef} />
        : <ControlledMultiSelect {...p} {...p.customProps} ref={localRef} />
})
