/**
 * Valida CPF (Cadastro de Pessoas Físicas)
 * Remove caracteres especiais e verifica se é válido
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres especiais
  const cleanCPF = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return false
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }

  // Calcula primeiro dígito verificador
  let sum = 0
  let remainder
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
    return false
  }

  // Calcula segundo dígito verificador
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
    return false
  }

  return true
}

/**
 * Valida data de nascimento
 * Verifica se a data é válida e não é no futuro
 */
export const validateBirthDate = (birthDate: string): boolean => {
  // Verifica se a data está no formato correto (YYYY-MM-DD)
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return false
  }

  const date = new Date(birthDate)
  const today = new Date()

  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return false
  }

  // Verifica se a data não é no futuro
  if (date > today) {
    return false
  }

  // Verifica se a pessoa tem pelo menos 4 anos (para alunos de artes marciais)
  const age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()
  const dayDiff = today.getDate() - date.getDate()

  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

  if (actualAge < 4) {
    return false
  }

  return true
}

/**
 * Formata CPF para exibição (XXX.XXX.XXX-XX)
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '')
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Remove formatação de CPF
 */
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '')
}
