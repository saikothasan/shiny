import { useState } from "react"
import { toast } from "sonner"
import {
  generateCardNumber,
  generateCVV,
  isValidBin,
  formatCardNumber,
  getCardTypeFromBin,
  type CardType,
} from "../utils/card"
import { lookupBin, type BinInfo } from "../utils/binLookup"

export interface GeneratedCard {
  number: string
  month: string
  year: string
  cvv: string
  type: CardType | null
  binInfo: BinInfo | null
}

interface UseCardGeneratorProps {
  initialQuantity?: number
}

export function useCardGenerator({ initialQuantity = 10 }: UseCardGeneratorProps = {}) {
  const [bins, setBins] = useState("")
  const [cvv, setCvv] = useState("")
  const [quantity, setQuantity] = useState(initialQuantity.toString())
  const [month, setMonth] = useState("random")
  const [year, setYear] = useState("random")
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString().slice(-2))

  const generateCards = async () => {
    try {
      setIsGenerating(true)
      const binList = bins
        .split(";")
        .map((bin) => bin.trim())
        .filter(Boolean)

      // Validation
      if (!binList.length) {
        toast.error("Please enter at least one BIN")
        return
      }

      // Validate each BIN
      const invalidBins = binList.filter((bin) => !isValidBin(bin))
      if (invalidBins.length) {
        toast.error(`Invalid BIN(s): ${invalidBins.join(", ")}`)
        return
      }

      const cards: GeneratedCard[] = []
      const qty = Math.min(Math.max(Number.parseInt(quantity) || 1, 1), 100)

      for (let i = 0; i < qty; i++) {
        const randomBin = binList[Math.floor(Math.random() * binList.length)]
        const cardType = getCardTypeFromBin(randomBin)
        const cardNumber = generateCardNumber(randomBin)
        const randomMonth = month === "random" ? months[Math.floor(Math.random() * months.length)] : month
        const randomYear = year === "random" ? years[Math.floor(Math.random() * years.length)] : year
        const randomCvv = cvv || generateCVV(cardType)

        // Perform BIN lookup
        const binInfo = await lookupBin(randomBin)

        cards.push({
          number: formatCardNumber(cardNumber, cardType),
          month: randomMonth,
          year: randomYear,
          cvv: randomCvv,
          type: cardType,
          binInfo,
        })

        // Add small delay to prevent UI freeze
        if (i % 10 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0))
        }
      }

      setGeneratedCards(cards)
      toast.success(`Generated ${cards.length} cards successfully`)
    } catch (error) {
      console.error("Error generating cards:", error)
      toast.error("Error generating cards. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyCards = () => {
    if (!generatedCards.length) {
      toast.error("No cards to copy")
      return
    }

    const text = generatedCards.map((card) => `${card.number}|${card.month}|${card.year}|${card.cvv}`).join("\n")

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Cards copied to clipboard"))
      .catch(() => toast.error("Failed to copy cards"))
  }

  return {
    bins,
    setBins,
    cvv,
    setCvv,
    quantity,
    setQuantity,
    month,
    setMonth,
    year,
    setYear,
    generatedCards,
    generateCards,
    copyCards,
    months,
    years,
    isGenerating,
  }
}

