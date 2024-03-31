import { Box, Slider, Text } from "@mantine/core";
import sizes from "./params/sizes";
import React = require('react')

export default function (props: any) {
    return <Box w='100%'>
            <Text fz='sm'>{props.name}</Text>
            <Slider
                label={(val) => sizes.find((mark) => mark.value === val).label}
                defaultValue={50}
                step={25}
                marks={sizes}
                styles={{ markLabel: { display: 'none' } }}
                onChange={props.onChange}
                {...props}
            />
        </Box>
}