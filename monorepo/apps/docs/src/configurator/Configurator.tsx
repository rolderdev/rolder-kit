import { Divider, Flex, Stack } from "@mantine/core";

export default function (props: any) {
    return <Flex w={props.w || '40%'}>
        <Divider orientation='vertical' />
        <Stack p='md' w='100%'>
            {props.children}
        </Stack>
    </Flex>
}