import { type ColorScheme, MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications, notifications } from "@mantine/notifications"
import { forwardRef, useState } from "react"
import 'dayjs/locale/ru'
import type { CompProps } from "./types"
import convertColor from '@packages/convertColor'

function MantineError(title: string, message?: string, autoClose?: boolean | number): void {
    notifications.show({ title, message, color: 'red', autoClose: autoClose ? autoClose : false })
}

export default forwardRef(function (props: CompProps) {
    const { notificationsPosition } = props

    const [colorScheme, setColorScheme] = useState<ColorScheme>(R.params.colorScheme || 'light')
    Noodl.Events.on("colorSchemeChanged", () => setColorScheme(R.params.colorScheme || 'light'))
    const backgroundColor = convertColor(colorScheme === 'dark' ? 'dark.7' : 'gray.0')
    const mantineTheme = eval(Noodl.getProjectSettings().mantineTheme)?.[0]

    R.libs.mantine = { MantineError }

    return <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
        theme={{
            colorScheme,
            datesLocale: 'ru',
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
})
