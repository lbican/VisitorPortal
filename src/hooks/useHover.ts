import React, { useState, useRef, useEffect } from 'react';

type UseHoverReturn = [boolean, React.RefObject<HTMLButtonElement>];

const useHover = (): UseHoverReturn => {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouseOver = (): void => setIsHovered(true);
    const handleMouseOut = (): void => setIsHovered(false);

    useEffect(() => {
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseover', handleMouseOver);
            node.addEventListener('mouseout', handleMouseOut);

            return () => {
                node.removeEventListener('mouseover', handleMouseOver);
                node.removeEventListener('mouseout', handleMouseOut);
            };
        }
    }, []);

    return [isHovered, ref];
};

export default useHover;
