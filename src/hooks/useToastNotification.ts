import { useToast } from '@chakra-ui/react';

const useToastNotification = () => {
    const toast = useToast();
    return {
        success: (description: string, title = 'Success') =>
            toast({
                title,
                description,
                status: 'success',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        warning: (description: string, title = 'Warning') =>
            toast({
                title,
                description,
                status: 'warning',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        error: (description: string, title = 'An error has occurred') =>
            toast({
                title,
                description,
                status: 'error',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        info: (description: string, title = 'Information') =>
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
