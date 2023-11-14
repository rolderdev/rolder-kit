import { ScrollArea } from "@mantine/core"
import { useShallowEffect, useViewportSize } from "@mantine/hooks"
import { forwardRef, useState } from "react"

export default forwardRef(function (props: any) {
    const { height: viewPortHeight } = useViewportSize()
    const [height, setHeight] = useState(0)
    useShallowEffect(() => {
        if (viewPortHeight > 0) {
            const scrollHeight = viewPortHeight - props.scrollAreaBottomOffset
            setHeight(scrollHeight)
        }
    }, [viewPortHeight])

    return <ScrollArea.Autosize
        mah={height}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </ScrollArea.Autosize>
})