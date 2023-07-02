import { AnimatePresence, motion } from 'framer-motion';
import { Alert, AlertIcon, Text, Button, HStack } from '@chakra-ui/react';
import React from 'react';
import { AuthError } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

interface AlertProps {
    error: AuthError | null;
}

const USER_REGISTERED = 'User already registered';

const AnimatedAlert: React.FC<AlertProps> = ({ error }) => {
    const { t } = useTranslation();

    const userAlreadyRegistered = (): boolean => {
        return error?.message === USER_REGISTERED;
    };

    return (
        <AnimatePresence>
            {error && (
                <Alert
                    status="error"
                    as={motion.div}
                    key="error_alert"
                    justifyContent="space-between"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                >
                    <HStack>
                        <AlertIcon />
                        <Text>{t(error.message)}</Text>
                    </HStack>
                    {userAlreadyRegistered() && (
                        <Button as={NavLink} to="/login">
                            {t('Login')}
                        </Button>
                    )}
                </Alert>
            )}
        </AnimatePresence>
    );
};

export default AnimatedAlert;
