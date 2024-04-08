import { StyleSheet, type Styles, View } from "@react-pdf/renderer";
import React from "react";
import Cell from "./cell";
import type { RowT } from "../types";
import utils from "./utils";

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: 1,
        borderTop: 0,
        borderStyle: "solid",
        borderColor: '#bfbfbf',
    }
})

const Row = (props: RowT) => {
    const { width, height, style, isFirst, isFixed } = props
    let prepStyle: Styles['string'] = {}

    if (width) prepStyle.width = width + "%"
    else prepStyle.width = "auto"
    if (height) prepStyle.height = height + "px"
    else prepStyle.height = "auto"
    if (isFirst) prepStyle.borderTop = 1

    prepStyle = utils.combineStyles(styles.row, prepStyle)
    prepStyle = utils.combineStyles(prepStyle, style)

    let widthArray = React.Children.map(props.children, (child: any) => child?.props.width || 0)

    const renderChildren = React.Children.map(props.children, (child, idx) => {
        if (child.type === Cell) {
            return React.cloneElement(
                child, { totalElements: React.Children.count(props.children), widthArray, isFirst: idx === 0 }
            )
        }
    })

    return <View style={prepStyle} wrap={false} fixed={isFixed}>
        {renderChildren}
    </View>
}

export default Row