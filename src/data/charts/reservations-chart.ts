import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { HashColorGenerator } from '../../utils/hash-color-generator';
import { ReservationData } from '../../utils/interfaces/chart/chart-types';

ChartJS.register(ArcElement, Tooltip, Legend);

export const reservationsOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: true,
            text: 'Reservations per unit',
        },
    },
};

export const transformToReservationData = (data: ReservationData[], filterBy: string) => {
    const groupedData: { [key: string]: number } = {};
    let labels: string[];
    let dataSet: number[];

    if (filterBy === 'Unit') {
        labels = data.map((item) => item.unit_name);
        dataSet = data.map((item) => item.num_reservations);
    } else {
        // Group and sum reservations by property_name
        data.forEach((item) => {
            if (groupedData[item.property_name]) {
                groupedData[item.property_name] += item.num_reservations;
            } else {
                groupedData[item.property_name] = item.num_reservations;
            }
        });

        labels = Object.keys(groupedData);
        dataSet = Object.values(groupedData);
    }

    const backgroundColors: string[] = labels.map((item) => HashColorGenerator.getColor(item));
    const borderColors: string[] = labels.map((item) => HashColorGenerator.getBorderColor(item));

    return {
        labels: labels,
        datasets: [
            {
                label: 'Number of Reservations',
                data: dataSet,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };
};
