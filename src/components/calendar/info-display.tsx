import {
    Alert,
    AlertIcon,
    Heading,
    HStack,
    Image,
    List,
    ListIcon,
    ListItem,
    VStack,
} from '@chakra-ui/react';
import { AiOutlineSelect } from 'react-icons/ai';
import { IoPricetag } from 'react-icons/io5';
import { FaFilePdf } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import EmptyCalendarImage from '../../assets/images/empty_cal.svg';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const InfoDisplay = () => {
    const { t } = useTranslation();
    return (
        <HStack alignItems="flex-start">
            <VStack w="full" alignItems="flex-start">
                <Alert status="info" mb={2} rounded={4}>
                    <AlertIcon />
                    {t('Please select property and unit to be able to edit calendar')}
                </Alert>
                <Heading as="h4" variant="h4" size="lg">
                    {t('How does it work?')}
                </Heading>
                <List spacing={4}>
                    <ListItem>
                        <ListIcon as={AiOutlineSelect} color="blue.200" />
                        {t('You select property and unit')}
                    </ListItem>
                    <ListItem>
                        <ListIcon as={IoPricetag} color="blue.200" />
                        {t('By clicking icon buttons and selecting dates you can assign prices')}
                    </ListItem>
                    <ListItem>
                        <ListIcon as={FaFilePdf} color="blue.200" />
                        {t('By clicking PDF button you can export your prices to PDF document')}
                    </ListItem>
                    <ListItem>
                        <ListIcon as={MdCheckCircle} color="blue.200" />
                        {t('To add new reservation click corresponding button')}
                    </ListItem>
                </List>
            </VStack>
            <Image
                src={EmptyCalendarImage}
                alt="Empty calendar"
                objectFit="contain"
                w="full"
                height="40rem"
            />
        </HStack>
    );
};
