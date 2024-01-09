import { Select } from "@mantine/core";

export default function (props: any) {
    return <Select
        label='Unit'
        w={72}
        rightSection={<></>}  
        rightSectionWidth={1}
        {...props}
    />
}