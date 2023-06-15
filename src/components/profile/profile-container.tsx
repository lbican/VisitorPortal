import React from 'react';
import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';

interface ProfileProps {
    avatar_url: string | null;
    username: string | null;
    full_name: string;
}

const ProfileContainer: React.FC<ProfileProps> = ({
    avatar_url,
    full_name,
    username,
}) => {
    return (
        <HStack mb={-20} spacing={4} pb={4}>
            <Avatar
                src={avatar_url || ''}
                name={full_name}
                borderRadius="full"
                size="2xl"
                border="2px solid"
                borderColor="gray.800"
                referrerPolicy="no-referrer"
                _dark={{
                    borderColor: 'gray.200',
                }}
            />
            <VStack spacing={0} py={10} alignItems="flex-start">
                <Text fontSize="3xl" fontWeight="bold" color="white">
                    {full_name}
                </Text>
                <Text color="white">@{username}</Text>
            </VStack>
        </HStack>
    );
};

export default ProfileContainer;
