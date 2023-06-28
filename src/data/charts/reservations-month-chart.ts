import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    ChartData,
    DataSet,
    MonthlyReservationData,
} from '../../utils/interfaces/chart/chart-types';
import { HashColorGenerator } from '../../utils/hash-color-generator';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const monthChartOptions = (title: string) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: title,
            },
        },
    };
};

export const transformToMonthlyReservationData = (
    reservationsData: MonthlyReservationData[],
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
    if (filterBy === 'Unit') {
        items = [...new Set(reservationsData.map((item) => item.unit_name))];
    } else {
        items = [...new Set(reservationsData.map((item) => item.property_name))];
    }

    const datasets: DataSet[] = items.reduce((acc: DataSet[], item: string) => {
        const filteredData = reservationsData.filter((data) =>
            filterBy === 'Unit' ? data.unit_name === item : data.property_name === item
        );

        const data = labels.map((label) => {
            const monthData = filteredData.filter((data) => data.month.trim() === label);
            return monthData.reduce((sum, data) => sum + data.num_reservations, 0);
        });

        acc.push({
            label: item,
            data,
            backgroundColor: HashColorGenerator.getColor(item),
        });

        return acc;
    }, []);

    return { labels, datasets };
};
