import { forwardRef, lazy, useImperativeHandle, useRef } from "react"
import type { Props } from "./types"
import { getCompProps } from '@packages/get-comp-props'

const FormSwitch = lazy(() => import("./src/formSwitch"))
const ControlledSwitch = lazy(() => import("./src/controlledSwitch"))

export default forwardRef(function (props: Props, ref) {
    const localRef = useRef<any>(null)
    useImperativeHandle(ref, () => ({
        reset() { localRef.current?.reset() }
    }), [])

    const p = { ...getCompProps(props) } as Props

    return props.useScope
        ? <FormSwitch {...p} {...p.customProps} ref={localRef} />
        : <ControlledSwitch {...p} {...p.customProps} ref={localRef} />
})
