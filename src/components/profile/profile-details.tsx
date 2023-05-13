import React, { useState } from 'react';
import { Button, HStack } from '@chakra-ui/react';
import { useAuth, UserProfile } from '../../context/auth-context';
import { AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import { motion } from 'framer-motion';
import ProfileEditor from '../../pages/profile/profile-editor';
import { UserService } from '../../services/user-service';

const ProfileDetails: React.FC<UserProfile> = (props) => {
    const { user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
                        leftIcon={isHovered || isEditing ? <AiFillEdit /> : <AiOutlineEdit />}
                        colorScheme="blue"
                        variant="solid"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsEditing(!isEditing)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Edit
                    </Button>
                )}
            </HStack>
            {isEditing && (
                <ProfileEditor
                    userProfile={user}
                    onSubmit={(data) => {
                        UserService.updateUserProfile(user?.id, data)
                            .then((res) => {
                                console.log('Success!');
                            })
                            .catch(() => {
                                console.log('Error!');
                            });
                    }}
                />
            )}
        </>
    );
};

export default ProfileDetails;
