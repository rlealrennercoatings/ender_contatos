export const maskPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export const maskCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
}

export const unmaskPhone = (value: string): string => {
  return value.replace(/\D/g, '')
}

export const unmaskCEP = (value: string): string => {
  return value.replace(/\D/g, '')
}
