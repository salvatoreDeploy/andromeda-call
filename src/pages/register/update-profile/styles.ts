import { Box, styled, Text } from '@chain-reaction-ui/react'

export const ProfileBox = styled(Box, {
  display: 'flex',
  marginTop: '$6',
  flexDirection: 'column',
  gap: '$4',

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  },
})

export const FormAnnotation = styled(Text, {
  color: '$gray200',
})
