import * as React from 'react'
import { fr } from 'date-fns/locale'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger, PopoverPortal } from '@radix-ui/react-popover'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Choisir une date',
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? format(value, 'PPP', { locale: fr }) : placeholder}
          </span>
          <CalendarIcon className="ml-2 h-5 w-5 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          side="bottom"
          align="start"
          className="z-[9999] mt-2 rounded-xl border bg-white p-2 shadow-xl w-auto"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date)
              if (date) setOpen(false)
            }}
            locale={fr}
            weekStartsOn={1}
            modifiersClassNames={{
              selected: 'bg-blue-600 text-white',
              today: 'border border-blue-600',
            }}
            className="p-2"
            classNames={{
              months: 'flex flex-col',
              caption: 'flex justify-between items-center mb-2 px-2',
              nav: 'flex gap-2',
              nav_button: 'rounded-full p-1 hover:bg-blue-100',
              table: 'w-full border-collapse',
              head_row: 'flex',
              head_cell: 'w-8 text-center text-xs text-gray-400',
              row: 'flex',
              cell: 'w-8 h-8 text-center text-sm rounded-lg cursor-pointer hover:bg-blue-50',
              selected: 'bg-blue-600 text-white',
              today: 'border border-blue-600',
              outside: 'text-gray-300',
            }}
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}
