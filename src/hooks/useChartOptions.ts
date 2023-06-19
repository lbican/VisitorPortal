import { useColorModeValue, useTheme } from '@chakra-ui/react';

export function useChartOptions(titleText: string) {
    const theme = useTheme();
    const labelsColor = useColorModeValue(
        theme.colors.chart.light.labels,
        theme.colors.chart.dark.labels
    );
    const gridLinesColor = useColorModeValue(
        theme.colors.chart.light.gridLines,
        theme.colors.chart.dark.gridLines
    );

    return {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: labelsColor,
                },
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: titleText,
                color: labelsColor,
            },
        },
        scales: {
            x: {
                grid: {
                    color: gridLinesColor,
                },
                ticks: {
                    color: labelsColor,
                },
            },
            y: {
                grid: {
                    color: gridLinesColor,
                },
                ticks: {
                    color: labelsColor,
                },
            },
        },
    };
}
