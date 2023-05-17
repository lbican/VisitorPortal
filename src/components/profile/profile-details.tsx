import React from 'react';
import { Button, HStack, useDisclosure } from '@chakra-ui/react';
import { useAuth, UserProfile } from '../../context/auth-context';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import { motion } from 'framer-motion';
import useHover from '../../hooks/useHover';
import ProfileUpdateModal from '../profile-update-modal';

const ProfileDetails: React.FC<UserProfile> = (props) => {
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isHovered, hoverRef] = useHover();

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
                height="full"
                borderRadius="lg"
                textAlign="left"
            >
                {isEditable() && (
                    <Button
                        as={motion.button}
                        leftIcon={isHovered || isOpen ? <AiFillEdit /> : <AiOutlineEdit />}
                        colorScheme="blue"
                        variant="solid"
                        whileTap={{ scale: 0.9 }}
                        onClick={onOpen}
                        ref={hoverRef}
                    >
                        Edit
                    </Button>
                )}
            </HStack>
            <ProfileUpdateModal isOpen={isOpen} onClose={onClose} userProfile={user} />
        </>
    );
};

export default ProfileDetails;
