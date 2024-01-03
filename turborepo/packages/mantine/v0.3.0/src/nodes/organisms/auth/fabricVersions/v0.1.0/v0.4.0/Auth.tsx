import { forwardRef, useState } from "react"
import { sendOutput, sendSignal } from "@rk/node-fabrik";
import ErrorHandler from "../../../../../../utils/errorHandler/v0.2.0/ErrorHandler"
import { isNotEmpty, useForm } from "@mantine/form"
import { Button, Group, Paper, PasswordInput, Stack, TextInput } from "@mantine/core"
import { dayjs } from "@rk/libs";
// @ts-ignore
import ms from "ms";
import Cookies from "js-cookie";
import { dbClassVersion } from "./getVersion";


declare type UserSession = {
    username: string
    jwt: string
    jwtExpiresAt: string
}

export default forwardRef(function (props: any) {
    const { Kuzzle } = window.R.libs
    const { sessionTimeout } = window.R.params
    const { dbName } = window.R.env

    function loginHandler(localCreds: LocalCreds) {
        setLoading(true)
        Kuzzle.connect().then(() =>
            Kuzzle.auth.login('local', localCreds, sessionTimeout)
                .then(async (jwt: string) => {
                    await Kuzzle.document.search('config', 'dbclass_v1', {}, { size: 100 }).then((r: any) => {
                        const dbClasses: any = {}
                        r.hits.map((i: any) => { dbClasses[i._source.name] = i._source })
                        window.R.dbClasses = dbClasses
                    })
                    const expiresAt = dayjs().add(ms(sessionTimeout), 'ms').format('YYYY-MM-DD HH:mm:ss')
                    const userSession = { username: localCreds.username, jwt, jwtExpiresAt: expiresAt }
                    Cookies.set('userSession', JSON.stringify(userSession), { expires: 30 })
                    if (dbName) Kuzzle.auth.getCurrentUser().then((user: any) => {
                        if (user._source.dbClass) Kuzzle.document.search(
                            dbName,
                            dbClassVersion(user._source.dbClass),
                            { query: { equals: { 'user.id': user._id } } },
                            { lang: 'koncorde' }
                        ).then((kRes: any) => {
                            const kItem = kRes.hits.find((i: any) => i._source.user?.id === user._id)
                            let rItem: any = { user: {} }
                            if (kItem) rItem = { ...kRes.hits[0]?._source, id: kRes.hits[0]?._id }
                            rItem.user = { ...user._source, id: user._id }
                            window.R.user = rItem
                            sendOutput(props.noodlNode, 'userRole', rItem.user.role?.value)
                            sendSignal(props.noodlNode, 'authenticated')
                            setLoading(false)
                        })
                        else {
                            sendOutput(props.noodlNode, 'userRole', user._source.role?.value)
                            sendSignal(props.noodlNode, 'authenticated')
                            setLoading(false)
                        }
                    })
                }).catch((error: any) => {
                    const errorMessage = error.code === 67305492 ? 'Неверный логин или пароль' : 'Неизвестная ошибка'
                    ErrorHandler(errorMessage, '', 2000)
                    setLoading(false)
                })
        )
    }

    const cookie = Cookies.get('userSession')
    const userSession: UserSession = cookie && JSON.parse(cookie)
    const form = useForm({
        initialValues: { username: userSession?.username, password: '' },
        validate: {
            username: isNotEmpty(),
            password: isNotEmpty()
        },
    })

    const [loading, setLoading] = useState(false)

    return (
        <Paper
            {...props}
            {...props.customProps}
        >
            <form onSubmit={form.onSubmit((localCreds) => loginHandler(localCreds))}>
                <Stack spacing={props.stackSpacing} >
                    <TextInput
                        autoFocus={userSession?.username ? false : true}
                        label="Логин"
                        withAsterisk {...form.getInputProps('username')}
                    />
                    <PasswordInput
                        autoFocus={userSession?.username ? true : false}
                        label="Пароль"
                        withAsterisk {...form.getInputProps('password')}
                    />
                    <Group position="right">
                        <Button
                            loading={loading}
                            type="submit"
                            mt="sm"
                            color={props.buttonColor}
                        >Вход
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    )
})