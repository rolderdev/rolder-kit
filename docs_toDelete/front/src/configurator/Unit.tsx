import { Select } from "@mantine/core";
import React from 'react'

export default function (props: any) {
    return <Select
        label='Unit'
        w={74}
        rightSection={<></>}  
        rightSectionWidth={1}
        {...props}
    />
}