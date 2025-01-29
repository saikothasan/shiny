// Luhn algorithm for card number validation
export function luhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "")
  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Generate valid card number from BIN
export function generateCardNumber(bin: string): string {
  const cardType = getCardTypeFromBin(bin)
  let cardNumber = bin
  let remainingLength: number

  switch (cardType) {
    case "AMEX":
      remainingLength = 15 - bin.length
      break
    case "DINERS_CLUB":
      remainingLength = 14 - bin.length
      break
    case "MAESTRO":
    case "UNIONPAY":
      remainingLength = Math.floor(Math.random() * 3) + 16 - bin.length // 16-19 digits
      break
    default:
      remainingLength = 16 - bin.length
  }

  // Generate remaining digits
  for (let i = 0; i < remainingLength - 1; i++) {
    cardNumber += Math.floor(Math.random() * 10).toString()
  }

  // Calculate and append check digit
  const checkDigit = generateCheckDigit(cardNumber)
  return cardNumber + checkDigit
}

// Function to generate check digit using Luhn algorithm
function generateCheckDigit(partialNumber: string): string {
  let sum = 0
  let isEven = false

  for (let i = partialNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(partialNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit.toString()
}

// Validate BIN format
export function isValidBin(bin: string): boolean {
  if (!/^\d{6,8}$/.test(bin)) {
    return false
  }
  return getCardTypeFromBin(bin) !== null
}

// Generate random CVV
export function generateCVV(cardType: CardType | null): string {
  if (cardType === "AMEX") {
    return Math.floor(Math.random() * 9000 + 1000).toString()
  }
  return Math.floor(Math.random() * 900 + 100).toString()
}

// Format card number with spaces
export function formatCardNumber(number: string, cardType: CardType | null): string {
  switch (cardType) {
    case "AMEX":
      return number.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3")
    case "DINERS_CLUB":
      return number.replace(/(\d{4})(\d{6})(\d{4})/, "$1 $2 $3")
    default:
      return number.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
  }
}

// Updated card types with more specific patterns
export const CARD_TYPES = {
  VISA: /^4\d{12}(\d{3})?$/,
  MASTERCARD: /^(5[1-5]\d{4}|2(2(?:2[1-9]|[3-9]\d)|[3-6]\d{2}|7(?:[01]\d|20)))\d{10}$/,
  AMEX: /^3[47]\d{13}$/,
  DISCOVER: /^6(?:011|5\d{2})\d{12}$/,
  JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
  DINERS_CLUB: /^3(?:0[0-5]|[68]\d)\d{11}$/,
  MAESTRO: /^(5018|5020|5038|6304|6759|6761|6763)\d{8,15}$/,
  UNIONPAY: /^(62|88)\d{14,17}$/,
} as const

export type CardType = keyof typeof CARD_TYPES

// Updated function to determine card type from BIN
export function getCardTypeFromBin(bin: string): CardType | null {
  for (const [type, pattern] of Object.entries(CARD_TYPES)) {
    if (pattern.test(bin.padEnd(16, "0"))) {
      return type as CardType
    }
  }
  return null
}

