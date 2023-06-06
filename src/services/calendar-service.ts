import supabase from '../../database';
import { format } from 'date-fns';

export interface IDatePrice {
    id: string;
    unit_id: string;
    date_range: [Date, Date];
    price: number;
}

export type TFormDatePrice = Omit<IDatePrice, 'id'>;

export class CalendarService {
    static async fetchDatePrices(unitId: string): Promise<IDatePrice[]> {
        const { data, error } = await supabase.from('Date_Price').select('*').eq('unit_id', unitId);

        if (error) {
            throw error;
        }

        // Map over the data to create new objects with parsed date ranges
        const parsedData = data.map((datePrice) => {
            const dateRange = datePrice.date_range.slice(1, -1).split(',');
            return {
                ...datePrice,
                date_range: [
                    this.normalizeDate(new Date(dateRange[0])),
                    this.normalizeDate(new Date(dateRange[1])),
                ],
            };
        });

        return parsedData as IDatePrice[];
    }

    private static normalizeDate(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
    }

    static async insertDatePrice(datePrice: TFormDatePrice): Promise<IDatePrice> {
        const startDate = this.normalizeDate(datePrice.date_range[0]);
        const endDate = this.normalizeDate(datePrice.date_range[1]);
        console.log(endDate);

        const { data, error } = await supabase
            .from('Date_Price')
            .insert([
                {
                    unit_id: datePrice.unit_id,
                    date_range: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
                    price: datePrice.price,
                },
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as IDatePrice;
    }
}
