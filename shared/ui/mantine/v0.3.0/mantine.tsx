import { ColorScheme, MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications, notifications } from "@mantine/notifications"
import { forwardRef, useState } from "react"
import 'dayjs/locale/ru'
import { CompProps } from "./types"
import convertColor from '@shared/convertColor'
import React from "react"

function MantineError(title?: string, message?: string, autoClose?: boolean | number): void {
    notifications.show({ title, message, color: 'red', autoClose: autoClose ? autoClose : false })
    console.error(message)
}

export default forwardRef(function (props: CompProps) {
    const { notificationsPosition } = props

    const [colorScheme, setColorScheme] = useState<ColorScheme>(window.R.params.colorScheme || 'light')
    window.Noodl.Events.on("colorSchemeChanged", () => setColorScheme(window.R.params.colorScheme || 'light'))
    const backgroundColor = convertColor(colorScheme === 'dark' ? 'dark.7' : 'gray.0')
    const mantineTheme = window.R.params.mantineTheme

    window.R.libs.mantine = { MantineError }

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
                ...mantineTheme
            }}>
            <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }} >
                <Notifications position={notificationsPosition} />
                {props.children}
            </DatesProvider>
        </MantineProvider >
    )
})