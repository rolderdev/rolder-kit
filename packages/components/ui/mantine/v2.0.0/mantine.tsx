import { createTheme, MantineProvider } from '@mantine/core';
import { DatesProvider } from "@mantine/dates"
import { Notifications, notifications } from "@mantine/notifications"
import { forwardRef } from "react"
import 'dayjs/locale/ru'
import type { CompProps } from "./types"
import React from 'react';

import '@mantine/core/styles.css';
//import '@mantine/dates/styles.css';

function MantineError(title: string, message?: string, autoClose?: boolean | number): void {
    notifications.show({ title, message, color: 'red', autoClose: autoClose ? autoClose : false })
}


export default forwardRef(function (props: CompProps) {
    const { notificationsPosition } = props

    //const [colorScheme, setColorScheme] = useState<ColorScheme>(R.params.colorScheme || 'light')
    //Noodl.Events.on("colorSchemeChanged", () => setColorScheme(R.params.colorScheme || 'light'))
    //const backgroundColor = convertColor(colorScheme === 'dark' ? 'dark.7' : 'gray.0')

    //const mantineTheme = eval(Noodl.getProjectSettings().mantineTheme)?.[0]
    const theme = createTheme({
        //datesLocale: 'ru',
        /* globalStyles: () => ({
            body: {
                backgroundColor: backgroundColor,
            }
        }), */
        //...mantineTheme
    });

    R.libs.mantine = { MantineError }

    return <MantineProvider
        theme={theme}>
        <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }} >
            <Notifications position={notificationsPosition} />
            {props.children}
        </DatesProvider>
    </MantineProvider >
})
