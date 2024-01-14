import { MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import { forwardRef } from "react"
import { useColorScheme, } from "@mantine/hooks"
import 'dayjs/locale/ru'

export default forwardRef(function (props: any) {
    const { notificationsPosition, detectColorScheme, colorScheme: cs } = props
    let colorScheme = useColorScheme()
    if (!detectColorScheme) colorScheme = cs
    window.R.params.colorScheme = colorScheme

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme,
                defaultRadius: 'md',
                globalStyles: (theme) => ({
                    body: {
                        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
                    }
                }),
            }}>
            <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>
                <Notifications position={notificationsPosition} />
                {props.children}
            </DatesProvider>
        </MantineProvider >
    )
})