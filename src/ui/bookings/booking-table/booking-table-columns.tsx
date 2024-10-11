'use client'
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Booking } from "../booking.types";
import { simpleDate, timeFormat } from "@/components/app-date";

export const BookingTableColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-surface"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      return (
        <div>{row.original.contact.email}</div>
      )
    }
  },
  {
    accessorKey: 'name',
    header: () => <div>Domain</div>,
    cell: ({ row }) => {
      const {name} = row.original.domain
      return (
        <div>{name}</div>
      )
    }
  },
  {
    accessorKey: 'date',
    header: () => <div className="">Date</div>,
    cell: ({row}) => {
      const date = simpleDate(row.original.date)
      return (
        <div>{date}</div>
      )
    }
  },  
  {
    accessorKey: 'time',
    header: () => <div className="">Time</div>,
    cell: ({row}) => {
      const date = timeFormat(row.original.date)
      return (
        <div>{date}</div>
      )
    }
  },  
  {
    accessorKey: 'discoveryResponses',
    header: () => <div className="">Answers</div>,
    cell: ({ row }) => {
      const { discoveryResponses } = row.original.contact
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-surface"
            >
              View
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-text text-lg md:text-2xl">Answers</SheetTitle>
              <SheetDescription className="text-text-secondary">
                These are {`${row.original.contact.email}'s answers to the discovery questions`}
              </SheetDescription>
            </SheetHeader>
            <ul className="mt-8 flex flex-col gap-4">
              {
                discoveryResponses && discoveryResponses.map((pair, i) => (
                  <li key={i}>
                    <AnswerResponse question={pair.question} answer={pair.answer} />
                  </li>
                ))
              }
            </ul>
          </SheetContent>
        </Sheet>
      )
    }
  }
]

function AnswerResponse({
  question,
  answer
}) {
  return(
    <div className="text-text">
      <h3 className="font-semibold text-text-foreground font-lg">
        {question}
      </h3>
      <p className="font-normal text-text font-medium">
        {answer}
      </p>
    </div>
  )
}