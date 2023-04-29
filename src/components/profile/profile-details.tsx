import React from 'react';
import { Text, HStack, Box } from '@chakra-ui/react';
import { FaEnvelope, FaMapPin, FaSuitcase } from 'react-icons/all';

interface ProfileContactProps {
    full_name: string;
    email: string;
    job_title: string;
    location: string;
}

const ProfileDetails: React.FC<ProfileContactProps> = ({
    full_name,
    email,
    job_title,
    location,
}) => {
    const contactDetails = [
        { icon: FaSuitcase, text: job_title },
        { icon: FaMapPin, text: location },
        { icon: FaEnvelope, text: email },
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
                {full_name}
            </Text>
            {contactDetails.map((detail, index) => (
                <HStack key={index} spacing={3} color="gray.700" _dark={{ color: 'gray.200' }}>
                    <detail.icon size={20} />
                    <Text fontSize="lg">{detail.text}</Text>
                </HStack>
            ))}
        </Box>
    );
};

export default ProfileDetails;
