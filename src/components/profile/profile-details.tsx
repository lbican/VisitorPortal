import React from 'react';
import { HStack, useDisclosure } from '@chakra-ui/react';
import { useAuth, UserProfile } from '../../context/auth-context';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import ProfileUpdateModal from './profile-update-modal';
import ReactiveButton from '../common/input/reactive-button';

const ProfileDetails: React.FC<UserProfile> = (props) => {
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isEditable = () => {
        return props.id === user?.id;
    };

    return (
        <>
            <HStack
                justifyContent="flex-end"
                px={8}
                my={4}
                width="full"
                borderRadius="lg"
                textAlign="left"
            >
                {isEditable() && (
                    <ReactiveButton
                        onClick={onOpen}
                        text="Edit"
                        icon={<AiOutlineEdit />}
                        hoveredIcon={<AiFillEdit />}
                        colorScheme="blue"
                        isActive={isOpen}
                    />
                )}
            </HStack>
            {user && <ProfileUpdateModal isOpen={isOpen} onClose={onClose} userProfile={user} />}
        </>
    );
};

export default ProfileDetails;
