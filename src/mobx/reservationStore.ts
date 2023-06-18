import { makeAutoObservable } from 'mobx';
import { IReservation } from '../utils/interfaces/typings';
import { ReservationService } from '../services/reservation-service';
import { CalendarService, IDatePrice } from '../services/calendar-service';

class ReservationStore {
    reservations: IReservation[] = [];
    unitPrices: IDatePrice[] = [];
    editingReservation: IReservation | undefined = undefined;
    isDeleting = false;
    isFetchingReservations = false;
    isFetchingPrices = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isFetchingData() {
        return this.isFetchingReservations || this.isFetchingPrices;
    }

    setReservations(reservations: IReservation[]) {
        this.reservations = reservations;
    }

    setUnitPrices(unitPrices: IDatePrice[]) {
        this.unitPrices = unitPrices;
    }

    setIsDeleting(value: boolean) {
        this.isDeleting = value;
    }

    setIsFetchingReservations(value: boolean) {
        this.isFetchingReservations = value;
    }

    setIsFetchingPrices(value: boolean) {
        this.isFetchingPrices = value;
    }

    async deleteReservation(reservationId: string) {
        this.setIsDeleting(true);
        try {
            await ReservationService.deleteReservation(reservationId);
            this.setReservations(
                this.reservations.filter((prop) => prop.id !== reservationId)
            );
        } finally {
            this.setIsDeleting(false);
        }
    }

    fetchUnitReservations = (selectedUnitId?: string) => {
        if (selectedUnitId) {
            this.setIsFetchingReservations(true);
            ReservationService.fetchReservations(selectedUnitId)
                .then((res) => {
                    this.setReservations(res);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.setIsFetchingReservations(false);
                });
        }
    };

    fetchDatePrices = (selectedUnitId?: string) => {
        if (selectedUnitId) {
            this.setIsFetchingPrices(true);
            CalendarService.fetchDatePrices(selectedUnitId)
                .then((datePrices) => {
                    this.setUnitPrices(datePrices);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.setIsFetchingPrices(false);
                });
        }
    };

    resetStore() {
        this.reservations = [];
        this.unitPrices = [];
        this.isDeleting = false;
        this.isFetchingPrices = false;
        this.isFetchingReservations = false;
        this.editingReservation = undefined;
    }
}

export const reservationStore = new ReservationStore();
