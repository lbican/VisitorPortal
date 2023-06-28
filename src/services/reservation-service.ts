import supabase from '../../database';
import { format, isBefore } from 'date-fns';
import { IFormReservation, IGuest, IReservation } from '../utils/interfaces/typings';
import { CalendarService } from './calendar-service';
import { Country } from '../utils/interfaces/utils';

export class ReservationService {
    static async getTotalPrice(unit_id: string, date_range: [Date, Date]): Promise<number | null> {
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
        const formattedRange = `[${format(date_range[0], 'yyyy-MM-dd')},${format(
            date_range[1],
            'yyyy-MM-dd'
        )}]`;

        const { data, error } = await supabase.rpc('insert_reservation_data', {
            p_first_name: newReservation.first_name,
            p_last_name: newReservation.last_name,
            p_guests_num: newReservation.guests_num,
            p_unit_id: newReservation.unit_id,
            p_date_range: formattedRange,
            p_total_price: newReservation.total_price,
            p_note: newReservation.note,
            p_type: newReservation.type,
            p_prepayment_percent: newReservation.prepayment_percent,
            p_prepayment_paid: newReservation.prepayment_paid,
            p_country_id: newReservation.country.id,
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

    static async fetchCountries(): Promise<Country[]> {
        const { data, error } = await supabase.from('Country').select('*');

        if (error) {
            throw error;
        }

        return data as Country[];
    }

    static async updateReservation(
        existingReservation: IFormReservation & IGuest
    ): Promise<IReservation> {
        const { date_range } = existingReservation;
        const formattedRange = `[${format(date_range[0], 'yyyy-MM-dd')},${format(
            date_range[1],
            'yyyy-MM-dd'
        )})`;

        const { data, error } = await supabase.rpc('update_reservation_data', {
            p_reservation_id: existingReservation.id,
            p_guest_id: existingReservation.guest_id,
            p_first_name: existingReservation.first_name,
            p_last_name: existingReservation.last_name,
            p_guests_num: existingReservation.guests_num,
            p_unit_id: existingReservation.unit_id,
            p_date_range: formattedRange,
            p_total_price: existingReservation.total_price,
            p_note: existingReservation.note,
            p_type: existingReservation.type,
            p_prepayment_percent: existingReservation.prepayment_percent,
            p_prepayment_paid: existingReservation.prepayment_paid,
            p_country_id: existingReservation.country.id,
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
        const { error } = await supabase.from('Reservation').delete().eq('id', reservationId);

        if (error) {
            throw error;
        }
    }

    private static async fulfillReservations(
        reservations: IReservation[]
    ): Promise<IReservation[]> {
        const today = new Date();
        const unfulfilledReservations = reservations.filter(
            (res) => !res.fulfilled && isBefore(res.date_range[1], today)
        );

        const unfulfilledIds = unfulfilledReservations.map((res) => res.id);

        if (unfulfilledIds.length > 0) {
            const { error } = await supabase
                .from('Reservation')
                .update({ fulfilled: true })
                .in('id', unfulfilledIds);

            if (error) {
                throw error;
            }

            // Update the local objects
            unfulfilledReservations.forEach((reservation) => (reservation.fulfilled = true));
        }

        return reservations;
    }

    static async fetchReservations(unitId?: string): Promise<IReservation[]> {
        if (!unitId) {
            throw new Error('Unit id was not provided!');
        }

        const { data: reservations, error } = await supabase.rpc('get_reservations_by_unit', {
            p_unit_id: unitId,
        });

        if (error) {
            console.error(error);
            throw error;
        }

        const parsedData = reservations.map((reservation: any) => {
            const dateRange = reservation.date_range.slice(1, -1).split(',');
            return {
                ...reservation,
                date_range: [
                    CalendarService.normalizeDate(new Date(dateRange[0])),
                    CalendarService.normalizeDate(new Date(dateRange[1])),
                ],
            };
        });

        return await this.fulfillReservations(parsedData as unknown as IReservation[]);
    }
}
