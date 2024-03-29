export function capitalizeFirstLetter(data: string) {
  const palavras: string[] = data.split(' ')
  palavras[palavras.length - 1] =
    palavras[palavras.length - 1].charAt(0).toUpperCase() +
    palavras[palavras.length - 1].substring(1)
  return palavras.join(' ')
}
