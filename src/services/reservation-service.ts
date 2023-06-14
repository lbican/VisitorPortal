import supabase from '../../database';
import { format } from 'date-fns';

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
}
