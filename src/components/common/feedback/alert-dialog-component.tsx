import React, { FC, useRef } from 'react';
import {
    AlertDialog as ChakraAlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button,
} from '@chakra-ui/react';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    dialogHeader: string;
    dialogBody: string;
}

const AlertDialogComponent: FC<AlertDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    dialogHeader,
    dialogBody,
}) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <ChakraAlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>{dialogHeader}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>{dialogBody}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            No
                        </Button>
                        <Button colorScheme="red" ml={3} onClick={onConfirm} isLoading={isLoading}>
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </ChakraAlertDialog>
        </>
    );
};

export default AlertDialogComponent;