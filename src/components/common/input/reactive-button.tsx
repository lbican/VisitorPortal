import React from 'react';
import { Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import useHover from '../../../hooks/useHover';
import { ThemeTypings } from '@chakra-ui/styled-system';

interface ReactiveButtonProps {
    onClick: () => void;
    text: string;
    icon: React.ReactElement;
    hoveredIcon: React.ReactElement;
    colorScheme: ThemeTypings['colorSchemes'];
    isActive?: boolean;
}

const ReactiveButton: React.FC<ReactiveButtonProps> = ({
    onClick,
    text,
    colorScheme,
    icon,
    hoveredIcon,
    isActive,
}) => {
    const [isHovered, hoverRef] = useHover();

    return (
        <Button
            as={motion.button}
            leftIcon={isHovered || isActive ? hoveredIcon : icon}
            colorScheme={colorScheme}
            variant="solid"
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            ref={hoverRef}
        >
            {text}
        </Button>
    );
};

export default ReactiveButton;
