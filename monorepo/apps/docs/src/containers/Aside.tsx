import { Flex, Paper, Stack } from '@mantine/core'
import Features from './Features'

export default function (props: any) {
    return <Stack align='flex-start'>
        <Features features={props.features} scopes={props.scopes} />
        <Paper withBorder radius='md' w='100%'>
            <Flex direction='row' justify='space-between' >
                {props.children}
            </Flex>
        </Paper>
    </Stack>
}