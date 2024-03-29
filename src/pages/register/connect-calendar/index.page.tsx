import { Button, Heading, MultiStep, Text } from '@chain-reaction-ui/react'
import { Conatiner, Header } from '../styles'
import { ArrowRight, Calendar, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  async function handleSiginCalendar() {
    await signIn('google')
  }

  async function handleNavigateCreatedTimeIntervals() {
    await router.push('/register/time-intervals')
  }

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Andromeda Call" noindex />

      <Conatiner>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} curretStep={2} />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>
            {isSignedIn ? (
              <Button size="sm" disabled>
                Conectado <Check weight="bold" />
              </Button>
            ) : (
              <Button
                variant={'secondary'}
                size={'md'}
                onClick={handleSiginCalendar}
              >
                Connectar
                <Calendar weight="bold" />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar.
            </AuthError>
          )}

          <Button
            onClick={handleNavigateCreatedTimeIntervals}
            type="submit"
            disabled={!isSignedIn}
          >
            <ArrowRight />
            Proximo Passo
          </Button>
        </ConnectBox>
      </Conatiner>
    </>
  )
}
