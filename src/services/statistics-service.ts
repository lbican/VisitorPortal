import supabase from '../../database';
import {
    ReservationData,
    MonthlyReservationData,
    MonthlyRevenueData,
} from '../utils/interfaces/chart/chart-types';

export class StatisticsService {
    static async getTotalReservations(userId?: string): Promise<ReservationData[]> {
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

    static async getMonthlyReservations(userId?: string): Promise<MonthlyReservationData[]> {
        if (!userId) {
            throw new Error('User id was not provided!');
        }

        const { data, error } = await supabase.rpc('get_user_properties_reservations_per_month', {
            _user_id: userId,
            _year: new Date().getFullYear(),
        });

        if (error) {
            throw error;
        }

        return data;
    }

    static async getMonthlyRevenue(userId?: string): Promise<MonthlyRevenueData[]> {
        if (!userId) {
            throw new Error('User id was not provided!');
        }

        const { data, error } = await supabase.rpc('get_user_properties_revenue_per_month', {
            _user_id: userId,
            _year: new Date().getFullYear(),
        });

        if (error) {
            throw error;
        }

        return data;
    }
}
