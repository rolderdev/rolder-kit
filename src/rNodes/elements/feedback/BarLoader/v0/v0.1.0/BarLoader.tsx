import { forwardRef } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { convertColor } from '../../../../../../utils/converters/v0.1.0/converters'

const Comp = forwardRef(function (props: any) {

  return (
    <BarLoader
      color={convertColor(props.loaderColor)}
      loading={props.loading}
      cssOverride={{
        borderRadius: 16,
        display: "block",
        position: 'absolute',
        width: props.w,
        zIndex: 2
      }}
    />
  )
})

export default Comp