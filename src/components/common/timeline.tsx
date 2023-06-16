import React from 'react';
import {
    Box,
    Text,
    HStack,
    VStack,
    Flex,
    Icon,
    useColorModeValue,
    Heading,
    Spinner,
} from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { FaRegNewspaper } from 'react-icons/fa';
import { BsGithub } from 'react-icons/bs';
import { IconType } from 'react-icons';
import { IReservation } from '../../utils/interfaces/typings';

const milestones = [
    {
        id: 1,
        title: 'Wrote first article on Medium',
        icon: FaRegNewspaper,
        description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
        date: 'MARCH 30, 2022',
    },
    {
        id: 2,
        title: 'First open source contribution',
        icon: BsGithub,
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date: 'July 30, 2022',
    },
];

interface TimelineProps {
    heading: string;
    reservations: IReservation[];
    loadingTimeline: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
    heading,
    reservations,
    loadingTimeline,
}) => {
    if (loadingTimeline) {
        return (
            <Flex justifyContent="center" alignItems="center" height="50%">
                <Spinner size="lg" />
            </Flex>
        );
    }

    return (
        <Box maxWidth="4xl" p={2}>
            <Heading as="h3" fontSize="4xl" fontWeight="bold" mb={18} textAlign="left">
                {heading}
            </Heading>
            {reservations.length === 0 && <p>No reservations yet!</p>}
            {reservations.map((reservation) => (
                <Flex key={reservation.id} mb="10px">
                    <LineWithDot />
                    <Card {...reservation} />
                </Flex>
            ))}
        </Box>
    );
};

const Card = (props: IReservation) => {
    const { first_name, last_name, guests_num } = props.guest;
    const { date_range, note } = props;

    return (
        <HStack
            p={{ base: 3, sm: 6 }}
            bg={useColorModeValue('gray.100', 'gray.800')}
            spacing={5}
            rounded="lg"
            alignItems="center"
            pos="relative"
            _before={{
                content: '""',
                w: '0',
                h: '0',
                borderColor: `transparent ${useColorModeValue(
                    '#edf2f6',
                    '#1a202c'
                )} transparent`,
                borderStyle: 'solid',
                borderWidth: '15px 15px 15px 0',
                position: 'absolute',
                left: '-15px',
                display: 'block',
            }}
        >
            {/*   <Icon as={icon} w={12} h={12} color="teal.400" />*/}
            <Box>
                <VStack spacing={2} mb={3} textAlign="left">
                    <Heading
                        as="h2"
                        _hover={{ color: 'teal.400' }}
                        size="md"
                        lineHeight={1.2}
                        fontWeight="bold"
                        w="100%"
                    >
                        {first_name} {last_name} | {guests_num}
                    </Heading>
                    <Text fontSize="md" noOfLines={2}>
                        {note}
                    </Text>
                </VStack>
                <Text fontSize="sm">{date_range[0].toLocaleDateString()}</Text>
            </Box>
        </HStack>
    );
};

const LineWithDot = () => {
    return (
        <Flex pos="relative" alignItems="center" mr="40px">
            <Text
                as="span"
                position="absolute"
                left="50%"
                height="calc(100% + 10px)"
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                top="0px"
            ></Text>
            <Box pos="relative" p="10px">
                <Box
                    pos="absolute"
                    width="100%"
                    height="100%"
                    bottom="0"
                    right="0"
                    top="0"
                    left="0"
                    backgroundSize="cover"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center center"
                    backgroundColor="rgb(255, 255, 255)"
                    borderRadius="100px"
                    border="3px solid rgb(4, 180, 180)"
                    backgroundImage="none"
                    opacity={1}
                ></Box>
            </Box>
        </Flex>
    );
};

export default Timeline;
