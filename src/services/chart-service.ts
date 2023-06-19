import supabase from '../../database';
import { ITotalReservations } from '../utils/interfaces/typings';

export class ChartService {
    static async getTotalReservations(userId?: string): Promise<ITotalReservations[]> {
        if (!userId) {
            throw new Error('User id was not provided!');
        }

        const { data, error } = await supabase.rpc('get_user_properties_reservations', {
            _user_id: userId,
        });

        if (error) {
            throw error;
        }

        return data;
    }
}
