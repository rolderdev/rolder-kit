import { ColorScheme, MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import { forwardRef, useState } from "react"
import 'dayjs/locale/ru'
import { CompProps } from "./types"
import convertColor from "../../../../../utils/convertColor/v0.2.0/convertColor"

export default forwardRef(function (props: CompProps) {
    const { notificationsPosition } = props

    const [colorScheme, setColorScheme] = useState<ColorScheme>(window.R.params.colorScheme)
    window.Noodl.Events.on("colorSchemeChanged", () => setColorScheme(window.R.params.colorScheme))
    const backgroundColor = convertColor(colorScheme === 'dark' ? 'dark.7' : 'gray.0')

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            withCSSVariables
            theme={{
                colorScheme,
                defaultRadius: 'md',
                globalStyles: () => ({
                    body: {
                        backgroundColor: backgroundColor,
                    }
                }),
                ...props.mantineTheme
            }}>
            <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }} >
                <Notifications position={notificationsPosition} />
                {props.children}
            </DatesProvider>
        </MantineProvider >
    )
})