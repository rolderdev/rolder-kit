import { MANTINE_COLORS, useMantineTheme } from "@mantine/core";

export default function (colorString?: string): string | undefined {
    const theme = useMantineTheme()
    if (colorString) {
        const name = colorString.split('.')[0]
        const shade = colorString.split('.')[1]
        if (MANTINE_COLORS.find(i => i === name) && name) {
            const mantineColor = theme.colors[name]
            const colorWithChade = shade && mantineColor ? mantineColor[parseInt(shade)] : undefined
            if (colorWithChade) return colorWithChade
            else if (mantineColor) return mantineColor[6]
            else return theme.primaryColor[6]
        } else return colorString
    } return undefined
}