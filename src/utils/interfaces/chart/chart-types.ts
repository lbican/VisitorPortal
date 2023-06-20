export interface ReservationData {
    property_name: string;
    unit_name: string;
    num_reservations: number;
}

export interface MonthlyReservationData extends ReservationData {
    month: string;
}

export interface MonthlyRevenueData extends Omit<MonthlyReservationData, 'num_reservations'> {
    total_price: number;
}

export interface YearlyReportData {
    total_reservations: number | null;
    reservation_percentage_change: number | null;
    total_price: number | null;
    total_price_percentage_change: number | null;
    avg_monthly_revenue: number | null;
    avg_monthly_revenue_percentage_change: number | null;
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
