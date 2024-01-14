import { HoverCard } from "@mantine/core"
import { QRCodeSVG } from "qrcode.react"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <HoverCard shadow="md">
        <HoverCard.Target>
            <QRCodeSVG {...props} size={props.sizeUnits} />
        </HoverCard.Target>
        <HoverCard.Dropdown>
            <QRCodeSVG {...props} size={280} />
        </HoverCard.Dropdown>
    </HoverCard>
})