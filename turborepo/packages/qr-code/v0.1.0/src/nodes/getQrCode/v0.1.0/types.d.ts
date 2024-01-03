import { qrQualityEnum } from "../getQrCodeNode";
import { BaseJsProps } from "@rk/node-fabrik/src/types";

export type CompProps = BaseJsProps & {
    qrString: string
    qrQuality: typeof qrQualityEnum[number]['value']
}