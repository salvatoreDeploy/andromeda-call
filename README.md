# Projeto Andromeda Call

## Tecnologias: React, Next

### Bibliotecas:

- @chain-reaction-ui/react
- Stiches
- Phospor-React
- React-Hook-Form
- Hook-Form-Resolver
- Zod
- Axios
- Nookies
- @types/cookies
- dayjs
- @tanstack/react-query
- googleapis

### Serviços Deploy

- Neon (Banco de Dados)
- Vercel (Aplicação)

### A fazer:

[X] Criar ambiente docker para esta aplicação com banco de dados postgres

### Logicas:

- Popular e criar o calendario:

Extrutura de cada mes []
Extrutura de cada semana []
Extrutura final [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14]]
Descobrir quantos dias tem no mes
Preencher os dias do mes anterior mas não sendo clicaveis
Preencher os dias do proximo mes mas não sendo clicaveis
Um array com as propriedades dos dias, [quantos dias tem o final do mes anterior para forma a semana, quantidade de dias tem o mes, , qauntos dias tem o inicio do proximo mes para fechar a semana] seguindo esta ordem
Criar um novo array usando o reduce, com o array acima citado, onde verificamos se é uma nova semana assim criamo um array contendos os dias de cada semana para formar o array que vai representar o mes.
