import { Grid } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Grid
        columns={props.gridColumnsCount}
        justify={props.gridJustify}
        align={props.gridAlign}
        {...props}
        {...props.customProps}
    >
        {props.children?.length && props.children?.map(
            (child: any, idx: number) => <Grid.Col key={idx} {...props.gridColumnsScheme[idx]}>{child}</Grid.Col>
        )}
    </Grid>
})