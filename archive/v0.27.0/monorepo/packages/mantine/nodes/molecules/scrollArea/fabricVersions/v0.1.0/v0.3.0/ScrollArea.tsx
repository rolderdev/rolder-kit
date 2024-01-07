import { ScrollArea } from "@mantine/core"
import { useShallowEffect, useViewportSize } from "@mantine/hooks"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"

export default forwardRef(function (props: any, ref) {
    const { height: viewPortHeight } = useViewportSize()
    const [height, setHeight] = useState(0)
    useShallowEffect(() => {
        if (viewPortHeight > 0) {
            const scrollHeight = viewPortHeight - props.scrollAreaBottomOffset
            setHeight(scrollHeight)
        }
    }, [viewPortHeight])

    const viewport = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
        scroll() {
            if (viewport.current) {
                viewport.current.scrollTo({ top: viewport.current.scrollHeight * props.scrollToMultiplier, behavior: props.scrollBehavior })
            }
        }
    }), [])

    return <ScrollArea.Autosize
        viewportRef={viewport}
        mah={height}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </ScrollArea.Autosize>
})