import { styled, Heading, Text } from '@chain-reaction-ui/react'

/* export const Container = styled('div', {
  maxWidth: '100%',
  margin: '0 auto',
  background: 'Red',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$20',
}) */

// Estilo com preview da imagem no canto da tela

export const Container = styled('div', {
  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
  height: '100vh',
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '$20',

  '@media(max-width: 720px)': {
    height: 'auto',
    paddingTop: '20px',
  },
})

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  [`> ${Heading}`]: {
    '@media(max-width: 720px)': {
      fontSize: '$6xl',
    },
  },

  [`> ${Text}`]: {
    margin: '$2',
    color: '$gray200',
  },
})

export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 720px)': {
    display: 'none',
  },
})
