"use client"

import { useState } from "react"
import { Toaster } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CreditCard, Info } from "lucide-react"
import { useCardGenerator } from "@/hooks/useCardGenerator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CCGenerator() {
  const {
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
  } = useCardGenerator()

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center flex items-center justify-center gap-2">
          <CreditCard className="w-8 h-8 text-[#7fff00]" />
          MULTI BIN CC GENERATOR
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[#7fff00] font-bold">Bins</label>
              <Input
                placeholder="Enter Your Bins XXXXXX;XXXXXX;XXXXXX"
                value={bins}
                onChange={(e) => setBins(e.target.value)}
                className="bg-[#333] border-0"
              />
              <p className="text-sm text-gray-400">* Separate your bins with ;</p>
            </div>

            <div className="space-y-2">
              <label className="text-[#7fff00] font-bold">Date</label>
              <div className="grid grid-cols-2 gap-4">
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="bg-[#333] border-0">
                    <SelectValue placeholder="Random" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random</SelectItem>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="bg-[#333] border-0">
                    <SelectValue placeholder="Random" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random</SelectItem>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#7fff00] font-bold">CVV</label>
              <Input
                placeholder="XXX or XXXX"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                className="bg-[#333] border-0"
              />
              <p className="text-sm text-gray-400">* Leave blank for random CVV</p>
            </div>

            <div className="space-y-2">
              <label className="text-[#7fff00] font-bold">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max="100"
                className="bg-[#333] border-0"
              />
            </div>

            <Button
              className="w-full bg-[#7fff00] hover:bg-[#7fff00]/90 text-black font-bold"
              onClick={generateCards}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <Textarea
              value={generatedCards.map((card) => `${card.number}|${card.month}|${card.year}|${card.cvv}`).join("\n")}
              readOnly
              className="h-[200px] bg-[#333] border-0 font-mono"
              placeholder="XXXX XXXX XXXX XXXX | XX | XX | XXX"
            />
            <div className="flex flex-wrap gap-2">
              {generatedCards.slice(0, 5).map((card, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-[#7fff00] cursor-pointer">
                        {card.binInfo?.scheme || "Unknown"}
                        <Info className="w-3 h-3 ml-1" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <p>Scheme: {card.binInfo?.scheme || "Unknown"}</p>
                        <p>Type: {card.binInfo?.type || "Unknown"}</p>
                        <p>Category: {card.binInfo?.category || "Unknown"}</p>
                        <p>
                          Country: {card.binInfo?.country.emoji || "🏴"} {card.binInfo?.country.name || "Unknown"}
                        </p>
                        <p>Bank: {card.binInfo?.bank.name || "Unknown"}</p>
                        <p>Bank Phone: {card.binInfo?.bank.phone || "N/A"}</p>
                        <p>Bank URL: {card.binInfo?.bank.url || "N/A"}</p>
                        <p>Card Length: {card.binInfo?.number.length || "Unknown"}</p>
                        <p>Luhn: {card.binInfo?.number.luhn ? "Yes" : "No"}</p>
                        {!card.binInfo?.success && (
                          <p className="text-yellow-500">BIN lookup failed. Showing default values.</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {generatedCards.length > 5 && (
                <Badge variant="outline" className="text-[#7fff00]">
                  +{generatedCards.length - 5} more
                </Badge>
              )}
            </div>
            <Button
              className="w-full bg-[#7fff00] hover:bg-[#7fff00]/90 text-black font-bold"
              onClick={copyCards}
              disabled={!generatedCards.length}
            >
              Copy Cards
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">
          Modified By <span className="text-[#7fff00]">@vipscraper</span>
        </p>
      </div>
      <Toaster position="top-center" theme="dark" />
    </div>
  )
}

