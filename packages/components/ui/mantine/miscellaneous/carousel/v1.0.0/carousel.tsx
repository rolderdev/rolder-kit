import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import { forwardRef, useState } from "react"
import type { Props } from "./types";;

export default forwardRef(function (props: Props) {
    const children = Array.isArray(props.children) ? props.children.slice(1) : [props.children]

    const [embla, setEmbla] = useState<Embla | null>(null);

    useAnimationOffsetEffect(embla, 200);

    return <Carousel
        getEmblaApi={setEmbla}
        slideSize="70%"
        slideGap="md"
        slidesToScroll={1}
        {...props}
        {...props.customProps}
    >
        {children.map((child: any, idx: number) => <Carousel.Slide key={idx}>{child}</Carousel.Slide>)}
    </Carousel>
})
