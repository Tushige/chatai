'use client';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export type Contact = {
  id: string;
  email: string;
};
export const EmailTableColumns: ColumnDef<Contact>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          return row.toggleSelected(!!value);
        }}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-surface'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'discoveryResponses',
    header: () => <div className=''>Answers</div>,
    cell: ({ row }) => {
      const { discoveryResponses } = row.original;
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='ghost' className='hover:bg-surface'>
              View
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className='text-lg text-text md:text-2xl'>
                Answers
              </SheetTitle>
              <SheetDescription className='text-text-secondary'>
                These are{' '}
                {`${row.original.email}'s answers to the discovery questions`}
              </SheetDescription>
            </SheetHeader>
            <ul className='mt-8 flex flex-col gap-4'>
              {discoveryResponses &&
                discoveryResponses.map((pair, i) => (
                  <li key={i}>
                    <AnswerResponse
                      question={pair.question}
                      answer={pair.answer}
                    />
                  </li>
                ))}
            </ul>
          </SheetContent>
        </Sheet>
      );
    },
  },
];

function AnswerResponse({ question, answer }) {
  return (
    <div className='text-text'>
      <h3 className='font-lg font-semibold text-text-foreground'>{question}</h3>
      <p className='font-medium font-normal text-text'>{answer}</p>
    </div>
  );
}

export default EmailTableColumns;
