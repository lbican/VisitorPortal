import supabase from '../../database';
import { format } from 'date-fns';
import { IFormReservation, IGuest, IReservation } from '../utils/interfaces/typings';

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
        });

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

        return reservations.map((reservation: any) => {
            const dates = reservation.date_range.slice(1, -1).split(',');
            reservation.date_range = [new Date(dates[0]), new Date(dates[1])];
            return reservation as IReservation;
        });
    }
}
