import { ColorScheme, MantineTheme } from "@mantine/core";
import { NotificationsProps } from "@mantine/notifications";
import { BaseProps } from "../../../../types";

export type CompProps = BaseProps & {
    notificationsPosition:  NotificationsProps['position']
    mantineTheme?: MantineTheme
}