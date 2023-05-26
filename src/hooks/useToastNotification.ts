import { useToast } from '@chakra-ui/react';

const useToastNotification = () => {
    const toast = useToast();
    return {
        success: (title: string, description: string) =>
            toast({
                title,
                description,
                status: 'success',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        warning: (title: string, description: string) =>
            toast({
                title,
                description,
                status: 'warning',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        error: (title: string, description: string) =>
            toast({
                title,
                description,
                status: 'error',
                duration: 9000,
                position: 'bottom-right',
                isClosable: true,
                variant: 'left-accent',
            }),
        info: (title: string, description: string) =>
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
