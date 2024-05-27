import { createTheme, MantineProvider, type MantineTheme } from '@mantine/core';
import { DatesProvider } from "@mantine/dates"
import { Notifications, notifications } from "@mantine/notifications"
import { forwardRef } from "react"
import type { CompProps } from "./types"
import addCssToHtmlHead from '@packages/add-css-to-html-head';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

addCssToHtmlHead(['mantine'])

/* function MantineError(title: string, message?: string, autoClose?: boolean | number): void {
    notifications.show({ title, message, color: 'red', autoClose: autoClose ? autoClose : false })
}
R.libs.mantine = { MantineError } */

export default forwardRef(function (props: CompProps, ref) {
    const { notificationsPosition, defaultColorScheme } = props

    const mantineTheme = eval(Noodl.getProjectSettings().mantineTheme)?.[0] as MantineTheme
    const theme = createTheme(mantineTheme);

    return <MantineProvider
        theme={theme}
        defaultColorScheme={defaultColorScheme}
    >
        <Notifications position={notificationsPosition} />
        <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }} >
            {props.children}
        </DatesProvider>
    </MantineProvider >
})
