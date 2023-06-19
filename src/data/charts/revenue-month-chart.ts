import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { HashColorGenerator } from '../../utils/hash-color-generator';
import { ChartData, DataSet, MonthlyRevenueData } from '../../utils/interfaces/chart/chart-types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const revenueMonthOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: true,
            text: 'Revenue per month',
        },
    },
};

export const transformToMonthlyRevenueData = (
    revenueData: MonthlyRevenueData[],
    filterBy: string,
    startMonth: number,
    endMonth: number
): ChartData => {
    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ].slice(startMonth, endMonth);

    let items: string[];
    if (filterBy === 'unit') {
        items = [...new Set(revenueData.map((item) => item.unit_name))];
    } else {
        items = [...new Set(revenueData.map((item) => item.property_name))];
    }

    const datasets: DataSet[] = items.reduce((acc: DataSet[], item: string) => {
        const filteredData = revenueData.filter((data) =>
            filterBy === 'unit' ? data.unit_name === item : data.property_name === item
        );

        const data = labels.map((label) => {
            const monthData = filteredData.filter((data) => data.month.trim() === label);
            return monthData.reduce((sum, data) => sum + data.total_price, 0);
        });

        acc.push({
            fill: true,
            label: item,
            data,
            backgroundColor: HashColorGenerator.getColor(item),
            borderColor: HashColorGenerator.getBorderColor(item),
        });

        return acc;
    }, []);

    return { labels, datasets };
};
