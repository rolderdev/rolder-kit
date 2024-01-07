import { forwardRef } from "react"
import BarLoader from "react-spinners/BarLoader"
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor"

export default forwardRef(function (props: any) {

    return <BarLoader
        color={convertColor(props.loaderColor)}
        loading={props.loading}
        cssOverride={{
            borderRadius: 4,
            width: props.barLoaderWidth,
            zIndex: props.zIndex,
            marginTop: props.mtNumber,
            marginBottom: props.barLoaderMarginBottom
        }}
        {...props}
    />
})