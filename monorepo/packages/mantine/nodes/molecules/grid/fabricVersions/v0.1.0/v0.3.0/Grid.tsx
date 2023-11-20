import { Grid } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {
    function Columns(p: { childIsRepeater: boolean, children: any }) {
        const { childIsRepeater, children } = p
        switch (true) {
            case Array.isArray(children) && childIsRepeater: return children.slice(1)
                .map((child: any, idx: number) => <Grid.Col {...props.gridColumnsScheme[idx]}>{child}</Grid.Col>)
            case Array.isArray(children) && !childIsRepeater: return children
                .map((child: any, idx: number) => <Grid.Col {...props.gridColumnsScheme[idx]}>{child}</Grid.Col>)
            case !Array.isArray(children): return <Grid.Col {...props.gridColumnsScheme[0]}>{children}</Grid.Col>
        }
    }

    return <Grid
        columns={props.gridColumnsCount}
        justify={props.gridJustify}
        align={props.gridAlign}
        {...props}
        {...props.customProps}
    >
        {Columns(props)}
    </Grid>
})