import React, { useEffect, useState, useCallback } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react';
import { AiOutlineSave } from 'react-icons/ai';
import { UserProfile } from '../../context/auth-context';
import ProfileEditor from '../../pages/profile/profile-editor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfileProvider } from '../../context/user-profile-context';
import { UserService } from '../../services/user-service';
import { useForm } from 'react-hook-form';
import { isEqual, pick } from 'lodash';
import useToastNotification from '../../hooks/useToastNotification';
import { PostgrestError } from '@supabase/supabase-js';

interface ContentModalProps {
    userProfile: UserProfile;
    isOpen: boolean;
    onClose: () => void;
}

const ProfileUpdateModal: React.FC<ContentModalProps> = ({ userProfile, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { refetch } = useProfileProvider();
    const notification = useToastNotification();

    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = useForm<Partial<UserProfile>>();

    const currentValues = watch();

    useEffect(() => {
        const pickedUserProfile = pick(userProfile, ['username', 'full_name', 'email']);
        setIsDisabled(isEqual(pickedUserProfile, currentValues));
    }, [currentValues]);

    const handleSuccess = (data: Partial<UserProfile>) => {
        notification.success('Account updated!', 'You have successfully updated your account.');

        if (data.username !== userProfile?.username) {
            navigate(`/user/${data.username}`, {
                replace: true,
                state: { from: location.pathname },
            });
        } else {
            refetch();
        }
    };

    const handleError = (error: PostgrestError | null) => {
        console.error(error);
        notification.error(
            'Could not update profile',
            'An error has occurred, please try again later'
        );
    };

    const handleFinally = () => {
        setLoading(false);
        onClose();
    };

    const handleFormSubmit = useCallback(
        (data: Partial<UserProfile>) => {
            if (isDisabled) {
                notification.warning(
                    'Could not update profile.',
                    'Please make some changes before updating profile.'
                );
                return;
            }

            setLoading(true);

            UserService.updateUserProfile(userProfile?.id, data)
                .then(() => handleSuccess(data))
                .catch(handleError)
                .finally(handleFinally);
        },
        [isDisabled, navigate, location, userProfile, notification, refetch, onClose]
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent>
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
                        leftIcon={<AiOutlineSave />}
                        onClick={handleSubmit(handleFormSubmit)}
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
