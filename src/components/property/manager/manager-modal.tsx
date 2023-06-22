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
import { observer } from 'mobx-react-lite';
import { propertyStore as store } from '../../../mobx/propertyStore';

interface ManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const notification = useToastNotification();
    const foundProfileBackground = useColorModeValue('whitesmoke', 'gray.800');
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const handleSearch = React.useCallback(
        debounce((searchTerm) => {
            if (searchTerm.length > 0) {
                setLoading(true);
                UserService.searchNonManagers(searchTerm, store.currentProperty?.id)
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
        [store.currentProperty?.id]
    );

    const addPropertyManager = (userId: string) => {
        setLoadingStates((prev) => ({ ...prev, [userId]: true }));
        PropertyService.addPropertyManager(userId, store.currentProperty?.id)
            .then(() => {
                notification.success(t('Manager successfully added!'));
                setSearchResults(searchResults.filter((user) => user.id !== userId));
            })
            .catch((error) => {
                console.error(error);
                notification.error(t('Could not add property manager'));
            })
            .finally(() => {
                setLoadingStates((prev) => ({ ...prev, [userId]: false }));
            });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        handleSearch(searchTerm);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {t('addManager', { forProperty: store.currentProperty?.name })}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        type="text"
                        value={searchTerm}
                        placeholder={t('Search by username')}
                        onChange={handleInputChange}
                    />
                    <VStack py={2}>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <>
                                {searchResults.map((user) => (
                                    <HStack
                                        borderRadius={4}
                                        bg={foundProfileBackground}
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
                                            isLoading={loadingStates[user.id] || false}
                                            aria-label="Add manager"
                                            icon={<AiOutlinePlus />}
                                        />
                                    </HStack>
                                ))}
                                {searchResults.length === 0 && (
                                    <Text>{t('No user found, start typing')}</Text>
                                )}
                            </>
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

export default observer(ManagerModal);
