import { ColorScheme } from "@mantine/core";
import { NotificationsProps } from "@mantine/notifications";
import { BaseProps } from "../../../../types";

export type CompProps = BaseProps & {
    appLoaderColor?: string
    colorScheme2: ColorScheme | 'auto'
    projectDefaults?: {
        dateFormat: string
    }
}