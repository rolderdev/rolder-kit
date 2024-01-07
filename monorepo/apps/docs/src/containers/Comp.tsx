import { Group } from "@mantine/core";

export default function (props: any) {
    return <Group p='md' position='center' w={props.w || '60%'}>{props.children}</Group>
}