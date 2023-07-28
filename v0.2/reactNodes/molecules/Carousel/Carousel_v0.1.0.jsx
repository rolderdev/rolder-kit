import { Carousel } from '@mantine/carousel'

export default function Carousel_v0_1_0(props) {
  const children = props.children.slice(1)
  console.log(children)
  if (!Array.isArray(props.children)) {
    console.warn('Carousel needs at least 2 children')
    return <></>
  }
  else return (
    <Carousel
      slideSize="50%"
      //height={64}
      align="start"
      slideGap="md"
      loop
      slidesToScroll={2}
      withIndicators
      //maw={400}
      //withControls={true}
      {...props}
      sx={props.sx?.length && { ...props.sx[0] }}
    >
      {children.map(child => <Carousel.Slide >{child}</Carousel.Slide>)}
    </Carousel>
  )
}