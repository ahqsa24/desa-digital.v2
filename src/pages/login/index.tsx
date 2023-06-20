import React from 'react'
import { paths } from 'Consts/path'
import Button from 'Components/button'
import { useForm } from 'react-hook-form'
import TextField from 'Components/textField'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { login } from 'Services/auth'
import { toast } from 'react-toastify'
import useAuthLS from 'Hooks/useAuthLS'
import { Action, Background, Container, Description, Label, ActionContainer, Title } from './_loginStyle'

const forms = [
  {
    label: 'Email',
    type: 'email',
    name: 'email',
  },
  {
    label: 'Kata sandi',
    type: 'password',
    name: 'password',
  },
]

function Login() {
  const navigate = useNavigate()
  const form = useForm()
  const { handleSubmit } = form

  const { mutateAsync } = useMutation(login)

  const { setAuth } = useAuthLS()

  const onLogin = async (data: any) => {
    try {
      const response = await mutateAsync(data)

      if (response?.length === 0) {
        //cek email regist
        setAuth({})
        toast('Email atau password salah', { type: 'error' })
        return
      }

      const user = response?.[0]
      const auth = {
        id: user?.id,
        email: user?.email,
        role: user?.role,
      }
      setAuth(auth)
      navigate(paths.LANDING_PAGE)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Background>
      <Container>
        <Title>Halo!</Title>
        <Description>Silakan masukkan akun</Description>

        <form onSubmit={handleSubmit(onLogin)}>
          {forms?.map(({ label, type, name }, idx) => (
            <React.Fragment key={idx}>
              <Label mt={12}>{label}</Label>
              <TextField mt={4} placeholder={label} type={type} name={name} form={form} />
            </React.Fragment>
          ))}

          <Button size='m' fullWidth mt={12} type='submit'>
            Masuk
          </Button>
        </form>

        <ActionContainer mt={24}>
          <Label>Belum memiliki akun?</Label>
          <Action onClick={() => navigate(paths.REGISTER_PAGE)}>Registrasi</Action>
        </ActionContainer>
      </Container>
    </Background>
  )
}

export default Login
