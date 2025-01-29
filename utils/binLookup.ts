export interface BinInfo {
  number: {
    iin: string
    length: number
    luhn: boolean
  }
  scheme: string
  type: string
  category: string
  country: {
    alpha2: string
    alpha3: string
    name: string
    emoji: string
  }
  bank: {
    name: string
    phone: string
    url: string
  }
  success: boolean
}

export async function lookupBin(bin: string): Promise<BinInfo | null> {
  try {
    const response = await fetch(`https://binlist.io/lookup/${bin}/`)
    if (!response.ok) {
      throw new Error(`BIN lookup failed with status: ${response.status}`)
    }
    const data: BinInfo = await response.json()
    return data
  } catch (error) {
    console.error("Error looking up BIN:", error)
    // Return a fallback BinInfo object with default values
    return {
      number: { iin: bin, length: 16, luhn: true },
      scheme: "Unknown",
      type: "Unknown",
      category: "Unknown",
      country: { alpha2: "XX", alpha3: "XXX", name: "Unknown", emoji: "🏴" },
      bank: { name: "Unknown", phone: "N/A", url: "N/A" },
      success: false,
    }
  }
}

