import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useToast,
} from '@chakra-ui/react';
import { AiFillSave, AiOutlineSave } from 'react-icons/ai';
import useHover from '../hooks/useHover';
import { UserProfile } from '../context/auth-context';
import ProfileEditor from '../pages/profile/profile-editor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfileProvider } from '../context/user-profile-context';
import { UserService } from '../services/user-service';
import { useForm } from 'react-hook-form';

interface ContentModalProps {
    userProfile: UserProfile | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProfileUpdateModal: React.FC<ContentModalProps> = ({ userProfile, isOpen, onClose }) => {
    const [isHovered, hoverRef] = useHover();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { refetch } = useProfileProvider();
    const toast = useToast();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<Partial<UserProfile>>();

    const handleFormSubmit = (data: Partial<UserProfile>) => {
        setLoading(true);
        UserService.updateUserProfile(userProfile?.id, data)
            .then(() => {
                toast({
                    title: 'Account updated!',
                    description: 'You have successfully updated your account',
                    status: 'success',
                    duration: 9000,
                    position: 'top-right',
                    isClosable: true,
                });

                if (data.username !== userProfile?.username) {
                    navigate(`/user/${data.username}`, {
                        replace: true,
                        state: { from: location.pathname },
                    });
                } else {
                    refetch();
                }
            })
            .catch((error) => {
                console.error(error);
                toast({
                    title: 'Failed to update account',
                    description: 'An error has occurred, please try again later',
                    status: 'error',
                    duration: 9000,
                    position: 'top-right',
                    isClosable: true,
                });
            })
            .finally(() => {
                setLoading(false);
                onClose();
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalHeader>Update your profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <ProfileEditor userProfile={userProfile} errors={errors} register={register} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="red" variant="outline" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        leftIcon={isHovered ? <AiFillSave /> : <AiOutlineSave />}
                        ref={hoverRef}
                        type="submit"
                        colorScheme="green"
                        alignSelf="flex-end"
                        isLoading={loading}
                        loadingText="Updating..."
                    >
                        Update
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ProfileUpdateModal;
