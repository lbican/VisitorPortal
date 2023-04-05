import React, { useCallback, useMemo, useState } from 'react';
import { Avatar, Wrap, WrapItem } from '@chakra-ui/react';
import { TbArrowsRandom } from 'react-icons/tb';
import { motion } from 'framer-motion';

interface SelectorProps {
    onSelect: (url: string) => void;
}

const PictureSelector: React.FC<SelectorProps> = ({ onSelect }) => {
    const [num, setNum] = useState<number>(0);

    const getRandomNumber = useCallback(() => Math.random() * 1000, []);

    const images = useMemo(
        () =>
            Array.from(
                { length: 5 },
                (_, index) =>
                    `https://api.dicebear.com/5.x/miniavs/svg?backgroundColor=63B3ED&seed=${
                        num + getRandomNumber() + index
                    }`
            ),
        [num, getRandomNumber]
    );

    return (
        <Wrap alignSelf={'center'} p={5}>
            {images.map((image, index) => {
                return (
                    <WrapItem key={index}>
                        <Avatar
                            as={motion.div}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            src={image}
                            onClick={() => {
                                onSelect(image);
                            }}
                        />
                    </WrapItem>
                );
            })}
            <WrapItem>
                <Avatar
                    as={motion.div}
                    whileHover={{ rotateZ: 60 }}
                    whileTap={{ rotateZ: 360 }}
                    bgColor={'blue.500'}
                    icon={<TbArrowsRandom />}
                    onClick={() => {
                        setNum(getRandomNumber);
                    }}
                />
            </WrapItem>
        </Wrap>
    );
};

export default React.memo(PictureSelector);
