import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import type { Props } from "./types"
import { getCompProps } from '@packages/get-comp-props'

const FormTextInput = lazy(() => import("./src/formTextInput"))
const ControlledTextInput = lazy(() => import("./src/controlledTextInput"))

export default forwardRef(function (props: Props, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { selectRef.current?.reset() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormTextInput {...p} {...p.customProps} ref={selectRef} />
        : <ControlledTextInput {...p} {...p.customProps} ref={selectRef} />
})
