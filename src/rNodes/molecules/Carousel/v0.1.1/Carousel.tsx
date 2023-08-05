import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel'
import { useState } from 'react';

export default function Carousel_v0_1_1(props: any) {
  const children = props.children.slice(1)

  const [embla, setEmbla] = useState<Embla | null>(null);

  useAnimationOffsetEffect(embla, 200);

  return (
    <Carousel
      getEmblaApi={setEmbla}
      slideSize="70%"
      //height='100%'
      //align='start'
      slideGap="md"
      //loop
      slidesToScroll={1}
      //withIndicators
      //w={'100%'}
      //withControls={true}
      {...props}
      sx={{ ...props.sx?.[0] }}
    >
      {children.map((child: any) => <Carousel.Slide >{child}</Carousel.Slide>)}
    </Carousel>
  )
}