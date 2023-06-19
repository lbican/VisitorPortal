import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ITotalReservations } from '../../utils/interfaces/typings';
import { HashColorGenerator } from '../../utils/hash-color-generator';

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

export const transformToReservationData = (data: ITotalReservations[]) => {
    const labels: string[] = data.map((item) => item.unit_name);
    const dataSet: number[] = data.map((item) => item.num_reservations);
    const backgroundColors: string[] = data.map((item) =>
        HashColorGenerator.getColor(item.unit_name)
    );
    const borderColors: string[] = data.map((item) =>
        HashColorGenerator.getBorderColor(item.unit_name)
    );

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

export const transformToReservationPropertyData = (data: ITotalReservations[]) => {
    const groupedData: { [key: string]: number } = {};

    // Group and sum reservations by property_name
    data.forEach((item) => {
        if (groupedData[item.property_name]) {
            groupedData[item.property_name] += item.num_reservations;
        } else {
            groupedData[item.property_name] = item.num_reservations;
        }
    });

    const labels: string[] = Object.keys(groupedData);
    const dataSet: number[] = Object.values(groupedData);
    const backgroundColors: string[] = labels.map((item) =>
        HashColorGenerator.getColor(item)
    );
    const borderColors: string[] = labels.map((item) =>
        HashColorGenerator.getBorderColor(item)
    );

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
