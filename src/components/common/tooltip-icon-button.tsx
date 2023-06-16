import React, { ReactElement } from 'react';
import { Tooltip, IconButton } from '@chakra-ui/react';
import { PlacementWithLogical } from '@chakra-ui/popper/dist/popper.placement';

interface TooltipButtonProps {
    hasArrow: boolean;
    placement: PlacementWithLogical;
    label: string;
    ariaLabel: string;
    colorScheme: string;
    onClick: () => void;
    icon: ReactElement;
    isDisabled: boolean;
}

const TooltipIconButton: React.FC<TooltipButtonProps> = ({
    hasArrow,
    placement,
    label,
    ariaLabel,
    colorScheme,
    onClick,
    icon,
    isDisabled,
}): ReactElement => {
    return (
        <Tooltip hasArrow={hasArrow} placement={placement} label={label}>
            <IconButton
                aria-label={ariaLabel}
                colorScheme={colorScheme}
                onClick={onClick}
                icon={icon}
                isDisabled={isDisabled}
            />
        </Tooltip>
    );
};

export default TooltipIconButton;
