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

    static async insertNewReservation(newReservation: IFormReservation & IGuest) {
        const { date_range } = newReservation;

        const { error } = await supabase.rpc('insert_into_guest_and_reservation', {
            _first_name: newReservation.first_name,
            _last_name: newReservation.last_name,
            _guests_num: newReservation.guests_num,
            _unit_id: newReservation.unit_id,
            _date_range: [
                format(date_range[0], 'yyyy-MM-dd'),
                format(date_range[1], 'yyyy-MM-dd'),
            ],
            _total_price: newReservation.total_price,
            _note: newReservation.note,
            _is_booking_reservation: newReservation.is_booking_reservation,
        });

        if (error) {
            throw error;
        }
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

        console.log(reservations);

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

        console.log(parsedData);

        return parsedData as unknown as IReservation[];
    }
}
