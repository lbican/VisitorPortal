import React from 'react';
import {
    HStack,
    VStack,
    Text,
    useColorModeValue,
    Flex,
    Icon,
    SimpleGrid,
    Stack,
    Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { IoBookOutline, IoCalendarOutline } from 'react-icons/io5';
import { IoLogoEuro } from 'react-icons/io';
import { YearlyReportData } from '../../utils/interfaces/chart/chart-types';
import { RxDividerHorizontal } from 'react-icons/rx';

enum StatDataType {
    NORMAL,
    FINANCIAL,
}

interface StatData {
    id: number;
    label: string;
    score: number;
    icon: IconType;
    percentage: string;
    type: StatDataType;
}

const StatsWithIcons = (yearlyReport: YearlyReportData) => {
    const { t } = useTranslation();

    const statData: StatData[] = [
        {
            id: 1,
            label: t('Total reservations'),
            score: yearlyReport.total_reservations ?? 0,
            icon: IoBookOutline,
            percentage:
                yearlyReport.reservation_percentage_change !== null
                    ? yearlyReport.reservation_percentage_change.toFixed(2)
                    : 'NO DATA',
            type: StatDataType.NORMAL,
        },
        {
            id: 2,
            label: t('Total revenue'),
            score: yearlyReport.total_price ?? 0,
            icon: IoLogoEuro,
            percentage:
                yearlyReport.total_price_percentage_change !== null
                    ? yearlyReport.total_price_percentage_change.toFixed(2)
                    : 'NO DATA',
            type: StatDataType.FINANCIAL,
        },
        {
            id: 3,
            label: t('Average monthly revenue'),
            score:
                yearlyReport.avg_monthly_revenue !== null
                    ? parseFloat(yearlyReport.avg_monthly_revenue.toFixed(2))
                    : 0,
            icon: IoCalendarOutline,
            percentage:
                yearlyReport.avg_monthly_revenue_percentage_change !== null
                    ? yearlyReport.avg_monthly_revenue_percentage_change.toFixed(2)
                    : 'NO DATA',
            type: StatDataType.FINANCIAL,
        },
    ];

    return (
        <Box maxW="7xl">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5}>
                {statData.map((data) => (
                    <Card key={data.id} data={data} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

const getPercentageIcon = (percentage: number | string) => {
    if (percentage === 'NO DATA' || Number(percentage) === 0) {
        return <Icon as={RxDividerHorizontal} w={6} h={6} color="gray.500" />;
    }
    return Number(percentage) >= 100 ? (
        <Icon as={BsArrowUpShort} w={6} h={6} color="green.400" />
    ) : (
        <Icon as={BsArrowDownShort} w={6} h={6} color="red.400" />
    );
};

const Card = ({ data }: { data: StatData }) => {
    return (
        <motion.div whileHover={{ translateY: -5 }}>
            <Stack
                direction="column"
                rounded="md"
                boxShadow={useColorModeValue(
                    '0 4px 6px rgba(160, 174, 192, 0.6)',
                    '2px 4px 6px rgba(9, 17, 28, 0.9)'
                )}
                w="100%"
                textAlign="left"
                align="start"
                spacing={0}
                role="group"
                overflow="hidden"
            >
                <HStack
                    py={6}
                    px={5}
                    spacing={4}
                    bg={useColorModeValue('gray.100', 'gray.800')}
                    w="100%"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        rounded="lg"
                        p={2}
                        bg="green.400"
                        position="relative"
                        w={12}
                        h={12}
                        overflow="hidden"
                        lineHeight={0}
                        boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
                    >
                        <Icon as={data.icon} w={6} h={6} color="white" />
                    </Flex>
                    <VStack spacing={0} align="start" maxW="lg" h="100%">
                        <Text as="h3" fontSize="md" noOfLines={2} color="gray.400">
                            {data.label}
                        </Text>
                        <HStack spacing={2}>
                            <Text as="h2" fontSize="lg" fontWeight="extrabold">
                                {data.score} {data.type === StatDataType.FINANCIAL && '€'}
                            </Text>
                            <Flex>
                                {getPercentageIcon(data.percentage)}
                                <Text as="h2" fontSize="md">
                                    {data.percentage === 'NO DATA'
                                        ? 'NO DATA'
                                        : `${data.percentage}%`}
                                </Text>
                            </Flex>
                        </HStack>
                    </VStack>
                </HStack>
            </Stack>
        </motion.div>
    );
};

export default StatsWithIcons;
