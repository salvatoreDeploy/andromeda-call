import {
  Button,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@chain-reaction-ui/react'
import { Conatiner, Form, FormError, Header } from './styles'
import { ArrowRight, WarningCircle } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '../../lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuario deve ter no min. 3 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O username pode ter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { message: 'O name deve ter no min. 3 caracteres' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
      }
    }
  }

  return (
    <>
      <NextSeo title="Criando sua conta | Andromeda Call" />

      <Conatiner>
        <Header>
          <Heading as="strong">Bem-vindo ao Andromeda Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} curretStep={1} />

          <Form as="form" onSubmit={handleSubmit(handleRegister)}>
            <label>
              <Text size="sm">Nome do usuário</Text>
              <TextInput
                prefix="projetosdeploy.com/"
                placeholder="seu-usuario"
                {...register('username')}
              />
              {errors.username && (
                <FormError size="sm">
                  <WarningCircle size={16} />
                  {errors.username.message}
                </FormError>
              )}
            </label>

            <label>
              <Text size="sm">Nome completo</Text>
              <TextInput placeholder="Digite seu nome" {...register('name')} />
              {errors.name && (
                <FormError size="sm">
                  <WarningCircle size={16} />
                  {errors.name.message}
                </FormError>
              )}
            </label>

            <Button type="submit" disabled={isSubmitting}>
              <ArrowRight />
              Proximo Passo
            </Button>
          </Form>
        </Header>
      </Conatiner>
    </>
  )
}
