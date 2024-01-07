import { Group, Loader, Paper } from "@mantine/core";

export default function () {
    return <Paper withBorder radius='md' w='100%' h={240}>
        <Group position='center' h='100%'><Loader size='lg' /></Group>
    </Paper>
}