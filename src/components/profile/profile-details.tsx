import React from 'react';
import { Text, HStack, Box } from '@chakra-ui/react';
import { BsCalendarDate } from 'react-icons/bs';
import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { UserProfile } from '../../context/auth-context';

const ProfileDetails: React.FC<UserProfile> = (props) => {
    const contactDetails = [
        { icon: AiOutlineUser, text: props.username },
        { icon: AiOutlineMail, text: props.email },
        { icon: BsCalendarDate, text: props.created_at },
    ];

    return (
        <Box
            gridColumn="span 8"
            px={8}
            py={4}
            width="full"
            height="full"
            borderRadius="lg"
            textAlign="left"
            mt={10}
        >
            <Text fontSize="4xl" fontWeight="bold" color="gray.800" _dark={{ color: 'white' }}>
                {props.full_name}
            </Text>
            {contactDetails.map((detail, index) => (
                <HStack
                    key={index}
                    spacing={4}
                    my={2}
                    color="gray.700"
                    _dark={{ color: 'gray.200' }}
                >
                    <detail.icon size={20} />
                    <Text fontSize="lg">{detail.text}</Text>
                </HStack>
            ))}
        </Box>
    );
};

export default ProfileDetails;
