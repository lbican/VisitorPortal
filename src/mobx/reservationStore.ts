import { action, observable, makeAutoObservable } from 'mobx';
import { IReservation } from '../utils/interfaces/typings';
import { ReservationService } from '../services/reservation-service';

class ReservationStore {
    @observable reservations: IReservation[] = [];
    @observable editingReservation: IReservation | undefined = undefined;
    @observable isDeleting = false;
    @observable isFetching = false;

    constructor() {
        makeAutoObservable(this);
    }

    @action
    setReservations(reservations: IReservation[]) {
        this.reservations = reservations;
    }

    @action
    setIsDeleting(value: boolean) {
        this.isDeleting = value;
    }

    @action
    setIsFetching(value: boolean) {
        this.isFetching = value;
    }

    @action
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

    @action
    fetchUnitReservations(selectedUnitId?: string) {
        if (selectedUnitId) {
            this.setIsFetching(true);
            ReservationService.fetchReservations(selectedUnitId)
                .then((res) => {
                    this.setReservations(res);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    this.setIsFetching(false);
                });
        }
    }

    @action
    resetStore() {
        this.reservations = [];
        this.isDeleting = false;
        this.isFetching = false;
        this.editingReservation = undefined;
    }
}

export const reservationStore = new ReservationStore();
