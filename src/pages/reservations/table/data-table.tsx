import * as React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import {
    useReactTable,
    flexRender,
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import { IReservation } from '../../../utils/interfaces/typings';
import columnHelpers from './table-accessors';
import { useTranslation } from 'react-i18next';

export type DataTableProps = {
    data: IReservation[];
};

export function DataTable({ data }: DataTableProps) {
    const { t } = useTranslation();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const handleEditClick = (reservation: IReservation) => {
        console.log(reservation);
    };

    const handleDeleteClick = (reservation: IReservation) => {
        console.log(reservation);
    };

    const table = useReactTable({
        columns: columnHelpers(t, handleEditClick, handleDeleteClick),
        data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    const getSortedIcon = (canSort: boolean, sortDir: string | boolean) => {
        if (!canSort) {
            return null;
        }

        if (!sortDir) {
            return <FaSort />;
        }

        return sortDir === 'desc' ? (
            <FaSortDown aria-label="sorted descending" />
        ) : (
            <FaSortUp aria-label="sorted ascending" />
        );
    };

    return (
        <Box overflowX="auto">
            <Table variant="striped" colorScheme="blue">
                <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const meta: any = header.column.columnDef.meta;
                                return (
                                    <Th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        isNumeric={meta?.isNumeric}
                                    >
                                        <chakra.div display="flex" alignItems="center">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}

                                            <chakra.span pl="4">
                                                {getSortedIcon(
                                                    header.column.getCanSort(),
                                                    header.column.getIsSorted()
                                                )}
                                            </chakra.span>
                                        </chakra.div>
                                    </Th>
                                );
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                                const meta: any = cell.column.columnDef.meta;
                                return (
                                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Td>
                                );
                            })}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}
