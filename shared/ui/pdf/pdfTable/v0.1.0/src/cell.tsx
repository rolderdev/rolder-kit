import { Image, Link, StyleSheet, Styles, Text, View } from "@react-pdf/renderer";
import React from "react";
import utils from "./utils";
import { Cell } from "../types";

const styles = StyleSheet.create({
    cell: {
        display: 'flex',
        borderLeftWidth: 0,
        borderRightWidth: 1,
        borderStyle: "solid",
        borderColor: '#bfbfbf',
    },
    text: {
        fontFamily: "Roboto",
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    image: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },
});

const Cell = (props: Cell) => {
    const { totalElements = 0, widthArray, width, align, isFirst, type, text, linkTitle } = props
    let cellStyle: Styles['string'] = {}

    const totalWidth = utils.sumOfArray(widthArray)
    const totalElementsThatHaveWidth = widthArray?.filter(width => width > 0).length || 0
    if (width) cellStyle.width = width + "%";
    else cellStyle.width = utils.calculateWidth(totalWidth, totalElements - totalElementsThatHaveWidth)
    if (isFirst) cellStyle.borderLeftWidth = 1

    switch (align) {
        case 'left': cellStyle.alignItems = 'flex-start'; break
        case 'center': cellStyle.alignItems = 'center'; break
        case 'right': cellStyle.alignItems = 'flex-end'; break
        default: cellStyle.alignItems = 'flex-start'
    }

    cellStyle = utils.combineStyles(styles.cell, cellStyle)
    cellStyle = utils.combineStyles(cellStyle, props.cellStyle?.cell)
    const textStyle = utils.combineStyles(styles.text, props.cellStyle?.text)
    const imageStyle = utils.combineStyles(styles.text, props.cellStyle?.image)

    return <View style={cellStyle}>
        {type === 'text'
            ? <Text style={textStyle}>{text}</Text>
            : type === 'link'
                ? <Text style={textStyle}><Link src={text}>{linkTitle}</Link></Text>
                : type === 'image'
                    ? text ? <Image style={imageStyle} src={text} /> : null
                    : null
        }
    </View>
}

export default Cell