import { sentenceCase } from "change-case";

export default function (values: string[], noCase?: boolean) {
    return values.map(v => ({
        value: v,
        label: noCase ? v : sentenceCase(v)
    }))
}