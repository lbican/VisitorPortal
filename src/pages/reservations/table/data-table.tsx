import * as React from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    chakra,
    useDisclosure,
} from '@chakra-ui/react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import {
    useReactTable,
    flexRender,
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import { IReservation, IUnit } from '../../../utils/interfaces/typings';
import columnHelpers from './table-accessors';
import { useTranslation } from 'react-i18next';
import { reservationStore } from '../../../mobx/reservationStore';
import useToastNotification from '../../../hooks/useToastNotification';
import AlertDialogComponent from '../../../components/common/feedback/alert-dialog-component';
import { observer } from 'mobx-react-lite';
import ReservationModal from '../form/reservation-modal';
import { useEffect } from 'react';

export type DataTableProps = {
    unit: IUnit | null;
    data: IReservation[];
};

const DataTable: React.FC<DataTableProps> = ({ unit, data }) => {
    const { t } = useTranslation();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const notification = useToastNotification();

    const {
        isOpen: isOpenDeleteAlert,
        onOpen: onOpenDeleteAlert,
        onClose: onCloseDeleteAlert,
    } = useDisclosure();

    const {
        isOpen: isReservationModalOpen,
        onOpen: onReservationModalOpen,
        onClose: onReservationModalClose,
    } = useDisclosure();

    useEffect(() => {
        return () => {
            reservationStore.setEditingReservation();
        };
    }, []);

    const confirmDeleteReservation = (reservationId?: string) => {
        if (reservationId) {
            reservationStore
                .deleteReservation(reservationId)
                .then(() => {
                    onCloseDeleteAlert();
                    notification.success(t('Successfully deleted reservation'));
                })
                .catch((e) => {
                    console.error(e);
                    notification.error(t('Could not delete reservation'));
                });
        }
    };

    const handleEditClick = (reservation: IReservation) => {
        onReservationModalOpen();
        console.log(isReservationModalOpen);
        reservationStore.setEditingReservation(reservation);
    };

    const handleDeleteClick = (reservation: IReservation) => {
        onOpenDeleteAlert();
        reservationStore.setEditingReservation(reservation);
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
        <>
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
                                            <chakra.div
                                                display="flex"
                                                alignItems="center"
                                            >
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
            <AlertDialogComponent
                isLoading={reservationStore.isDeleting}
                isOpen={isOpenDeleteAlert}
                onClose={onCloseDeleteAlert}
                onConfirm={() =>
                    confirmDeleteReservation(reservationStore.editingReservation?.id)
                }
                dialogBody={t('confirmDeleteReservation', {
                    reservationHolder: `${reservationStore.editingReservation?.guest.first_name} ${reservationStore.editingReservation?.guest.last_name}`,
                })}
                dialogHeader={t('Confirm deletion')}
                dialogConfirmText={t('Delete')}
                dialogDeclineText={t('Cancel')}
            />
            {unit && (
                <ReservationModal
                    isOpen={isReservationModalOpen}
                    onClose={onReservationModalClose}
                    unit={unit}
                    date_range={[new Date(), new Date()]}
                />
            )}
        </>
    );
};

export default observer(DataTable);
