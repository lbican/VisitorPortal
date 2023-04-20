import { AnimatePresence, motion } from 'framer-motion';
import { Alert, AlertIcon } from '@chakra-ui/react';
import React from 'react';
import { AuthError } from '@supabase/supabase-js';

interface AlertProps {
    error: AuthError | null;
}

const AnimatedAlert: React.FC<AlertProps> = ({ error }) => {
    return (
        <AnimatePresence>
            {error && (
                <Alert
                    status="error"
                    as={motion.div}
                    key="error_alert"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                >
                    <AlertIcon />
                    {error.message}
                </Alert>
            )}
        </AnimatePresence>
    );
};

export default AnimatedAlert;
