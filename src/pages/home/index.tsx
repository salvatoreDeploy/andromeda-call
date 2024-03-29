import { Heading, Text } from '@chain-reaction-ui/react'
import { Container, Hero, Preview } from './styles'
import Image from 'next/image'
import previewImage from '../../assets/Imgcalendar.png'
import { ClaimUsernameForm } from '../Components/ClaimUsername'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Andromeda Call"
        description="Conect seu calendario e permita que as pessoas marquem agendamento no seu tempo livre"
      />
      <Container>
        <Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>
          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            height={400}
            quality={100}
            priority
            alt="Calendario simbolizando aplicaçãoo em funcionamento"
          />
        </Preview>
      </Container>
    </>
  )
}
