'use client';
import { Input } from '@/components/ui/input';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  RowSelectionState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateCampaignContacts } from '@/actions/campaign.action';
import { Campaign } from '@prisma/client';

interface EmailTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  contacts: TData[];
  campaign: Campaign;
}

export type Contact = {
  id: string;
  email: string;
};

export default function EmailTable<TData, TValue>({
  columns,
  contacts,
  campaign,
}: EmailTableProps<TData, TValue>) {
  const initialSelectionState = useMemo(() => {
    return campaign.contacts.reduce((agg, curr) => {
      agg[curr.id] = true;
      return agg;
    }, {});
  }, [campaign]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialSelectionState
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { toast } = useToast();

  const table = useReactTable({
    data: contacts,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection,
      sorting,
      columnFilters,
    },
    getRowId: (row) => row.id,
  });

  async function save() {
    try {
      await updateCampaignContacts(campaign.id, Object.keys(rowSelection));
      toast({
        title: 'Success',
        description: 'Updated Campaign mailing list',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Oops. Something went wrong.',
        className: 'text-error',
      });
    }
  }

  return (
    <>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          className='hover:bg-surface'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          className='hover:bg-surface'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter emails...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            return table.getColumn('email')?.setFilterValue(event.target.value);
          }}
          className='max-w-sm'
        />
      </div>
      <div className='w-full rounded-md border border-border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  You have no contacts with this domain
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          className='hover:bg-surface'
          size='sm'
          onClick={save}
          disabled={false}
        >
          Save
        </Button>
      </div>
    </>
  );
}
