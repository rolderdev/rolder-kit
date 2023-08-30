import { DefaultMantineColor, MantineNumberSize } from "@mantine/core";
import { convertColor } from "../../../../../../utils/converters/v0.1.0/converters";
import { MRT_TableOptions } from "mantine-react-table";

export default function mantineLoadingOverlayProps(
    { loaderColor, loaderSize }: { loaderColor: DefaultMantineColor, loaderSize: MantineNumberSize }
): MRT_TableOptions['mantineLoadingOverlayProps'] {
    return {
        loaderProps: {
            color: convertColor(loaderColor),
            size: loaderSize
        }
    }
}