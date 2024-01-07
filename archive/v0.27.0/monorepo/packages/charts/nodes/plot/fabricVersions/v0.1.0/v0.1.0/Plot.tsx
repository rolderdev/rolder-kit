import { forwardRef, useEffect, useRef } from "react"

export default forwardRef(function (props: any) {
    const { items, plotFunc } = props
    const containerRef = useRef<any>();

    useEffect(() => {
        if (items === undefined) return;
        containerRef.current?.append(plotFunc);
        return () => plotFunc.remove();
    }, [items]);

    return <div ref={containerRef} />;
})