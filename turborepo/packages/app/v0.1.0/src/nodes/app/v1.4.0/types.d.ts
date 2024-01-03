import { ColorScheme } from "@mantine/core";
import { NotificationsProps } from "@mantine/notifications";
import { BaseProps } from "../../../../types";
import { RolderType } from "@rk/types";

export type CompProps = BaseProps & {
    appLoaderColor?: string
    colorScheme2: ColorScheme | 'auto'
    projectDefaults?: {
        dateFormat: string
    }
}

declare global {
    interface Window {
        R: RolderType
        Noodl: any
    }
}