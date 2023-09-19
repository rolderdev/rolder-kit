import { forwardRef } from 'react'
import { Paper, Stack, Button, TextInput, PasswordInput, Group } from "@mantine/core"
import { useForm, isNotEmpty } from "@mantine/form"
import Cookies from "js-cookie";
import ErrorHandler from '../../../../../libs/errorHandler/v0.1.0/ErrorHandler';
import { sendOutput, sendSignal } from '../../../../../main/ports/send/v0.3.0/send';
import login from '../../../../../libs/dataService/2_back/auth/v0.2.0/login';
import validateJwt from '../../../../../libs/dataService/2_back/auth/v0.2.0/validateJwt';

const Comp = forwardRef(function (props: any) {
  const { node } = props

  function loginHandler(localCreds: LocalCreds) {
    login(localCreds).then((r: { error: string; message: string }) => {
      if (r.error) ErrorHandler({ title: r.message, autoClose: 2000 })
      else {
        validateJwt()
        window.Kuzzle?.auth.getCurrentUser().then((res: any) => {
          sendOutput(node, 'userRole', res.content.role?.value)
          sendSignal(node, 'authenticated')
        })
      }
    })
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

  return (
    <Paper {...props} sx={props.sx?.length && { ...props.sx[0] }} >
      <form onSubmit={form.onSubmit((localCreds) => loginHandler(localCreds))}>
        <Stack spacing={props.stackSpacing} >
          <TextInput autoFocus={userSession?.username ? false : true} label="Логин" withAsterisk {...form.getInputProps('username')} />
          <PasswordInput autoFocus={userSession?.username ? true : false} label="Пароль" withAsterisk {...form.getInputProps('password')} />
          <Group position="right"><Button type="submit" mt="sm" color={props.buttonColor}>Вход</Button></Group>
        </Stack>
      </form>
    </Paper>
  )
})

export default Comp