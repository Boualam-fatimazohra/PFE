"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="border border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2"
        >
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          {date ? format(date, "PPP") : "Sélectionner une date"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
