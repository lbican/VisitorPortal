import React, { ReactElement, useEffect, useState } from 'react';
import { Divider, Grid, GridItem, Heading, HStack, Skeleton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { reservationsOptions } from '../../data/charts/reservations-chart';
import {
    monthChartOptions,
    transformToMonthlyReservationData,
} from '../../data/charts/reservations-month-chart';
import {
    revenueMonthOptions,
    transformToMonthlyRevenueData,
} from '../../data/charts/revenue-month-chart';
import { StatisticsService } from '../../services/statistics-service';
import { useAuth } from '../../context/auth-context';
import { transformToReservationData } from '../../data/charts/reservations-chart';
import {
    ReservationData,
    MonthlyReservationData,
    MonthlyRevenueData,
} from '../../utils/interfaces/chart/chart-types';
import ChartSwitcher from '../../components/chart/chart-switcher';
import NoData from '../../components/common/no-data';
import _ from 'lodash';

const Dashboard = (): ReactElement => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [totalReservationsData, setTotalReservationsData] = useState<ReservationData[]>(
        []
    );
    const [monthlyReservationData, setMonthlyReservationData] = useState<
        MonthlyReservationData[]
    >([]);
    const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenueData[]>(
        []
    );
    const [loading, setLoading] = useState(false);
    const [filterBy, setFilterBy] = useState<string>('unit');

    useEffect(() => {
        setLoading(true);
        StatisticsService.getTotalReservations(user?.id)
            .then((res) => {
                setTotalReservationsData(res);
            })
            .catch((error) => {
                console.error(error);
            });

        StatisticsService.getMonthlyReservations(user?.id)
            .then((res) => {
                console.log(res);
                setMonthlyReservationData(res);
            })
            .catch((error) => {
                console.error(error);
            });

        StatisticsService.getMonthlyRevenue(user?.id)
            .then((res) => {
                console.log(res);
                setMonthlyRevenueData(res);
            })
            .catch((error) => {
                console.error(error);
            });

        setLoading(false);
    }, []);

    const checkForNoData = () => {
        const areAllEmpty = _.every(
            [totalReservationsData, monthlyReservationData, monthlyRevenueData],
            _.isEmpty
        );

        return !loading && areAllEmpty;
    };

    return (
        <>
            <HStack justifyContent="space-between">
                <Heading as="h2" size="lg">
                    {t('Dashboard')}
                </Heading>
                <ChartSwitcher
                    defaultValue={filterBy}
                    options={['unit', 'property']}
                    setFilterBy={setFilterBy}
                />
            </HStack>
            <Divider my={4} />
            {checkForNoData() ? (
                <NoData />
            ) : (
                <Grid
                    templateRows={{ base: 'repeat(3, 1fr)', md: 'repeat(1, 1fr)' }}
                    templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(5, 1fr)' }}
                    gap={4}
                >
                    <GridItem colSpan={{ base: 1, md: 1 }}>
                        <Skeleton isLoaded={!loading}>
                            <Pie
                                data={transformToReservationData(
                                    totalReservationsData,
                                    filterBy
                                )}
                                options={reservationsOptions}
                            />
                        </Skeleton>
                    </GridItem>
                    <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Skeleton isLoaded={!loading}>
                            <Bar
                                data={transformToMonthlyReservationData(
                                    monthlyReservationData,
                                    filterBy,
                                    new Date().getMonth() - 2,
                                    new Date().getMonth() + 4
                                )}
                                options={monthChartOptions}
                            />
                        </Skeleton>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Skeleton isLoaded={!loading}>
                            <Line
                                data={transformToMonthlyRevenueData(
                                    monthlyRevenueData,
                                    filterBy,
                                    new Date().getMonth() - 2,
                                    new Date().getMonth() + 4
                                )}
                                options={revenueMonthOptions}
                            />
                        </Skeleton>
                    </GridItem>
                </Grid>
            )}
        </>
    );
};

export default Dashboard;
