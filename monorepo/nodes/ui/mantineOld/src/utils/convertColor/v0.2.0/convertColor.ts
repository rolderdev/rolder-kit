import { MANTINE_COLORS, useMantineTheme } from "@mantine/core";

export default function (colorString?: string): string {
    const theme = useMantineTheme()
    if (colorString) {
        const colorArr: string[] = colorString?.split('.')
        if (colorArr && MANTINE_COLORS.find(i => i === colorArr[0])) {
            const mantineColor = theme.colors[colorArr[0]]
            if (colorArr.length === 2) return mantineColor[parseInt(colorArr[1])]
            else return mantineColor[6]
        }
    }
    return theme.primaryColor[6]
}