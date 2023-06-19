import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const monthChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Number of reservations per month',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const monthChartData = {
    labels,
    datasets: [
        {
            label: 'Two bedroom apartment',
            data: labels.map(() => Math.random() * 5),
            backgroundColor: 'rgba(49,130,206,0.61)',
        },
        {
            label: 'One bedroom apartment',
            data: labels.map(() => Math.random() * 5),
            backgroundColor: 'rgb(96,180,118)',
        },
        {
            label: 'Third apartment',
            data: labels.map(() => Math.random() * 5),
            backgroundColor: 'rgb(211,96,96)',
        },
    ],
};
