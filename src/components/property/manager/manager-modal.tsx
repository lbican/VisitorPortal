import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Input,
    VStack,
    HStack,
    Avatar,
    Text,
    useColorModeValue,
    IconButton,
    Spinner,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { UserProfile } from '../../../context/auth-context';
import { UserService } from '../../../services/user-service';
import { AiOutlinePlus } from 'react-icons/ai';
import PropertyService from '../../../services/property-service';
import useToastNotification from '../../../hooks/useToastNotification';

interface ManagerModalProps {
    propertyId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({
    isOpen,
    onClose,
    propertyId,
}) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const notification = useToastNotification();

    const handleSearch = React.useCallback(
        debounce((searchTerm) => {
            console.log('SEARCHING');
            if (searchTerm.length > 0) {
                setLoading(true);
                UserService.searchNonManagers(propertyId, searchTerm)
                    .then((profiles) => {
                        setSearchResults(profiles);
                    })
                    .catch((error) => {
                        console.error(error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setSearchResults([]);
            }
        }, 500),
        [propertyId]
    );

    const addPropertyManager = (userId: string) => {
        PropertyService.addPropertyManager(propertyId, userId)
            .then(() => {
                notification.success(t('Manager successfully added!'));
                setSearchResults(searchResults.filter((user) => user.id !== userId));
            })
            .catch((error) => {
                console.error(error);
                notification.error(t('Could not add property manager'));
            });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        handleSearch(searchTerm);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('Add manager')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        type="text"
                        value={searchTerm}
                        placeholder="Search Users"
                        onChange={handleInputChange}
                    />
                    <VStack py={2}>
                        {loading ? (
                            <Spinner />
                        ) : (
                            searchResults.map((user) => (
                                <HStack
                                    borderRadius={4}
                                    bg={useColorModeValue('white', 'gray.800')}
                                    key={user.id}
                                    my={1}
                                    p={2}
                                    justifyContent="space-between"
                                    w="full"
                                >
                                    <HStack>
                                        <Avatar
                                            size="sm"
                                            src={user.avatar_url ?? undefined}
                                            name={user.full_name}
                                        />
                                        <Text as="b">{user.username}</Text>
                                    </HStack>
                                    <IconButton
                                        onClick={() => addPropertyManager(user.id)}
                                        colorScheme="green"
                                        aria-label="Add manager"
                                        icon={<AiOutlinePlus />}
                                    />
                                </HStack>
                            ))
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" colorScheme="red" mr={3} onClick={onClose}>
                        {t('Close')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ManagerModal;
