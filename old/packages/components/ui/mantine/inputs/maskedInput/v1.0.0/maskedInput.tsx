import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import type { Props } from "./types"
import { getCompProps } from '@packages/get-comp-props'

const FormMaskedInput = lazy(() => import("./src/formMaskedInput"))
const ControlledMaskedInput = lazy(() => import("./src/controlledMaskedInput"))

export default forwardRef(function (props: Props, ref) {
    const selectRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { selectRef.current?.reset() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormMaskedInput {...p} {...p.customProps} ref={selectRef} />
        : <ControlledMaskedInput {...p} {...p.customProps} ref={selectRef} />
})
