import React, { ReactElement, useEffect, useState } from 'react';
import { Divider, Grid, GridItem, Heading, Skeleton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { reservationsOptions } from '../../data/charts/reservations-chart';
import {
    monthChartData,
    monthChartOptions,
} from '../../data/charts/reservations-month-chart';
import { revenueData, revenueMonthOptions } from '../../data/charts/revenue-month-chart';
import { ITotalReservations } from '../../utils/interfaces/typings';
import { ChartService } from '../../services/chart-service';
import { useAuth } from '../../context/auth-context';
import {
    transformToReservationData,
    transformToReservationPropertyData,
} from '../../data/charts/reservations-chart';

const Dashboard = (): ReactElement => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [unitReservations, setUnitReservations] = useState<ITotalReservations[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        ChartService.getTotalReservations(user?.id)
            .then((res) => {
                setUnitReservations(res);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Heading as="h2" size="lg">
                {t('Dashboard')}
            </Heading>
            <Divider my={2} />
            <Grid templateRows="repeat(1, 1fr)" templateColumns="repeat(6, 1fr)" gap={4}>
                <GridItem colSpan={1}>
                    <Skeleton isLoaded={!loading}>
                        <Pie
                            data={transformToReservationData(unitReservations)}
                            options={reservationsOptions}
                        />
                    </Skeleton>
                </GridItem>
                <GridItem colSpan={1}>
                    <Skeleton isLoaded={!loading}>
                        <Pie
                            data={transformToReservationPropertyData(unitReservations)}
                            options={reservationsOptions}
                        />
                    </Skeleton>
                </GridItem>
                <GridItem colSpan={2}>
                    <Bar data={monthChartData} options={monthChartOptions} />
                </GridItem>
                <GridItem colSpan={2}>
                    <Line data={revenueData} options={revenueMonthOptions} />
                </GridItem>
            </Grid>
        </>
    );
};

export default Dashboard;
