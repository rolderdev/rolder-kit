import { MantineColor, createStyles } from "@mantine/core";
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor";

interface RowProps {
    bgColor: MantineColor
    onHoverBgColor: MantineColor
    selectedBgColor: MantineColor
}

export const useRowStyles = createStyles((_, { bgColor, onHoverBgColor, selectedBgColor }: RowProps) => ({
    base: {
        '&&': { backgroundColor: convertColor(bgColor) },
        '&& td': { '&:hover': { backgroundColor: convertColor(onHoverBgColor) } },
    },
    selected: {
        '&&': { backgroundColor: convertColor(selectedBgColor) },
        '&& td': { '&:hover': { backgroundColor: convertColor(onHoverBgColor) } },
    },
}));