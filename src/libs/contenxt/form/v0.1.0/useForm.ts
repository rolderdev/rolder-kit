import { createFormContext } from "@mantine/form";

interface FormValues {
    [key: string]: any
}
export const [FormProvider, useFormContext, useForm] = createFormContext<FormValues>()
export function useFormContextWitchCheck() {
    try { return useFormContext() }
    catch { return undefined }
}