import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import React from 'react'

export default function (props: any) {
    return <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
        theme={{
            datesLocale: 'ru',
        }}>
        <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }} >
            <Notifications />
            {props.children}
        </DatesProvider>
    </MantineProvider >
}