import { forwardRef } from 'react'
import auth from "../../../../../libs/kuzzle/v.0.1.0/auth"
import { Paper, Stack, Button, TextInput, PasswordInput, Group } from "@mantine/core"
import { useForm, isNotEmpty } from "@mantine/form"
import ErrorHandler from "../../../../../libs/errorHandler/v0.1.0/ErrorHandler"
import validateJwt from "../../../../../libs/validateJwt/v0.1.0/validateJwt"
import Cookies from "js-cookie";
import { sendOutput, sendSignal } from '../../../../../utils/noodl/v0.1.0/send'

const Comp = forwardRef(function (props: any) {
  const { noodlNode } = props

  const loginHandler = (values: { login: string; password: string }) => {
    const { login: username, password } = values
    auth.login({ credentials: { username, password } })
      .then((response: { error: string; message: string }) => {
        if (response.error) ErrorHandler({ title: response.message, autoClose: 2000 })
        else {
          validateJwt()
          Cookies.set('username', username, { expires: 30 })
          window.Kuzzle?.auth.getCurrentUser().then((res: any) => {
            sendOutput({ noodlNode, portName: 'userRole', value: res.content.role?.value })
            sendSignal({ noodlNode, portName: 'authenticated' })
          })
        }
      })
  }

  const usernameCookie = Cookies.get('username') || ''
  const form = useForm({
    initialValues: { login: usernameCookie, password: '' },
    validate: {
      login: isNotEmpty(),
      password: isNotEmpty()
    },
  })

  return (
    <Paper {...props} sx={props.sx?.length && { ...props.sx[0] }} >
      <form onSubmit={form.onSubmit((values) => loginHandler(values))}>
        <Stack spacing={props.stackSpacing} >
          <TextInput autoFocus={usernameCookie ? false : true} label="Логин" withAsterisk {...form.getInputProps('login')} />
          <PasswordInput autoFocus={usernameCookie ? true : false} label="Пароль" withAsterisk {...form.getInputProps('password')} />
          <Group position="right"><Button type="submit" mt="sm" color={props.buttonColor}>Вход</Button></Group>
        </Stack>
      </form>
    </Paper>
  )
})

export default Comp