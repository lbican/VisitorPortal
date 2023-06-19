export interface ReservationData {
    property_name: string;
    unit_name: string;
    num_reservations: number;
}

export interface MonthlyReservationData extends ReservationData {
    month: string;
}

export interface MonthlyRevenueData
    extends Omit<MonthlyReservationData, 'num_reservations'> {
    total_price: number;
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
    }[];
}

export interface DataSet {
    label: string;
    data: number[];
    backgroundColor: string;
    fill?: boolean;
    borderColor?: string;
}
