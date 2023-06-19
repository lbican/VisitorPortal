import supabase from '../../database';
import { format } from 'date-fns';
import { IFormReservation, IGuest, IReservation } from '../utils/interfaces/typings';
import { CalendarService } from './calendar-service';

export class ReservationService {
    static async getTotalPrice(
        unit_id: string,
        date_range: [Date, Date]
    ): Promise<number | null> {
        const { data, error } = await supabase.rpc('calculate_total_price', {
            unit_id_arg: unit_id,
            date_range_arg: [
                format(date_range[0], 'yyyy-MM-dd'),
                format(date_range[1], 'yyyy-MM-dd'),
            ],
        });

        if (error) {
            console.error('Error calculating total price: ', error);
            return null;
        }

        return data;
    }

    static async insertNewReservation(
        newReservation: IFormReservation & IGuest
    ): Promise<IReservation> {
        const { date_range } = newReservation;

        const { data, error } = await supabase.rpc('insert_into_guest_and_reservation', {
            p_first_name: newReservation.first_name,
            p_last_name: newReservation.last_name,
            p_guests_num: newReservation.guests_num,
            p_unit_id: newReservation.unit_id,
            p_date_range: [
                format(date_range[0], 'yyyy-MM-dd'),
                format(date_range[1], 'yyyy-MM-dd'),
            ],
            p_total_price: newReservation.total_price,
            p_note: newReservation.note,
            p_is_booking_reservation: newReservation.is_booking_reservation,
        });

        if (error) {
            throw error;
        }

        const stringDateRange: [string, string] = data.date_range.slice(1, -1).split(',');
        return {
            ...data,
            date_range: [
                CalendarService.normalizeDate(new Date(stringDateRange[0])),
                CalendarService.normalizeDate(new Date(stringDateRange[1])),
            ],
        };
    }

    static async updateReservation(
        existingReservation: IFormReservation & IGuest
    ): Promise<IReservation> {
        const { date_range } = existingReservation;

        const { data, error } = await supabase.rpc('update_guest_and_reservation', {
            p_reservation_id: existingReservation.id,
            p_guest_id: existingReservation.guest_id,
            p_first_name: existingReservation.first_name,
            p_last_name: existingReservation.last_name,
            p_guests_num: existingReservation.guests_num,
            p_unit_id: existingReservation.unit_id,
            p_date_range: [
                format(date_range[0], 'yyyy-MM-dd'),
                format(date_range[1], 'yyyy-MM-dd'),
            ],
            p_total_price: existingReservation.total_price,
            p_note: existingReservation.note,
            p_is_booking_reservation: existingReservation.is_booking_reservation,
        });

        if (error) {
            throw error;
        }

        const stringDateRange: [string, string] = data.date_range.slice(1, -1).split(',');
        return {
            ...data,
            date_range: [
                CalendarService.normalizeDate(new Date(stringDateRange[0])),
                CalendarService.normalizeDate(new Date(stringDateRange[1])),
            ],
        };
    }

    static async deleteReservation(reservationId: string) {
        const { error } = await supabase
            .from('Reservation')
            .delete()
            .eq('id', reservationId);

        if (error) {
            throw error;
        }
    }

    static async fetchReservations(unitId?: string): Promise<IReservation[]> {
        if (!unitId) {
            throw new Error('Unit id was not provided!');
        }

        const { data: reservations, error } = await supabase
            .from('Reservation')
            .select(
                `
              id,
              date_range,
              total_price,
              fulfilled,
              adv_payment_paid,
              created_at,
              updated_at,
              note,
              is_booking_reservation,
              guest:Guest (
                id,
                first_name,
                last_name,
                guests_num
              ),
              unit:Unit (
                id,
                name,
                capacity
              )
        `
            )
            .eq('unit_id', unitId);

        if (error) {
            throw error;
        }

        const parsedData = reservations.map((reservation) => {
            const dateRange = reservation.date_range.slice(1, -1).split(',');
            return {
                ...reservation,
                date_range: [
                    CalendarService.normalizeDate(new Date(dateRange[0])),
                    CalendarService.normalizeDate(new Date(dateRange[1])),
                ],
            };
        });

        return parsedData as unknown as IReservation[];
    }
}
