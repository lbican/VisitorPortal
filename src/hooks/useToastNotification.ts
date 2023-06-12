import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const useToastNotification = () => {
    const toast = useToast();
    const { t } = useTranslation();
    return {
        success: (description: string, title = t('Success')) =>
            toast({
                title,
                description,
                status: 'success',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        warning: (description: string, title = t('Warning')) =>
            toast({
                title,
                description,
                status: 'warning',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        error: (description: string, title = t('An error has occurred')) =>
            toast({
                title,
                description,
                status: 'error',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        info: (description: string, title = t('Information')) =>
            toast({
                title,
                description,
                status: 'info',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
    };
};

export default useToastNotification;
