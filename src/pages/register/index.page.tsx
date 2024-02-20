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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  async function handleRegister(data: RegisterFormData) {
    console.log(data)
  }

  return (
    <Conatiner>
      <Header>
        <Heading as="strong">Bem-vindo ao Andromeda Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
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
  )
}
