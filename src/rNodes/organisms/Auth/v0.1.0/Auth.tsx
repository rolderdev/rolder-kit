import auth from "../../../../libs/kuzzle/v.0.1.0/auth"
import { Paper, Stack, Button, TextInput, PasswordInput, Group } from "@mantine/core"
import { useFocusTrap } from "@mantine/hooks"
import { useForm, isNotEmpty } from "@mantine/form"
import ErrorHandler from "../../../../libs/errorHandler/v0.1.0/ErrorHandler"
import validateJwt from "../../../../libs/validateJwt/v0.1.0/validateJwt"

export default function Auth_v0_1_0(props: any) {
  const loginHandler = (values: { login: string; password: string }) => {
    const { login: username, password } = values
    auth.login({ credentials: { username, password } })
      .then((response: { error: string; message: string }) => {
        if (response.error) ErrorHandler({ title: response.message })
        else {
          validateJwt()
          props.authenticated()
        }
      })
  }

  const focusTrapRef = useFocusTrap()
  const form = useForm({
    initialValues: { login: '', password: '' },
    validate: {
      login: isNotEmpty(),
      password: isNotEmpty()
    },
  })

  return (
    <Paper {...props} sx={props.sx?.length && { ...props.sx[0] }} >
      <form onSubmit={form.onSubmit((values) => loginHandler(values))}>
        <Stack spacing={props.stackSpacing} ref={focusTrapRef}>
          <TextInput label="Логин" withAsterisk {...form.getInputProps('login')} />
          <PasswordInput label="Пароль" withAsterisk {...form.getInputProps('password')} />
          <Group position="right"><Button type="submit" mt="sm" color={props.buttonColor}>Вход</Button></Group>
        </Stack>
      </form>
    </Paper>
  )
}