import {
    Box,
    StepIcon,
    StepIndicator,
    StepNumber,
    Stepper,
    Step,
    StepTitle,
    StepStatus,
    StepDescription,
    StepSeparator,
} from '@chakra-ui/react';
import React from 'react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionStepTitle = motion(StepTitle);
const MotionStepDescription = motion(StepDescription);

export interface FormStep {
    title: string;
    description?: string;
}

interface FormStepperProps {
    steps: FormStep[];
    activeStep: number;
    orientation: 'vertical' | 'horizontal';
    height?: string;
    animate?: boolean;
}
const FormStepper: React.FC<FormStepperProps> = ({
    steps,
    activeStep,
    orientation,
    height,
    animate,
}) => {
    const variants = {
        idle: { scale: 1 },
        wiggle: { scale: [1, 1.05, 1], rotate: [0, 2, -2, 2, 0] },
    };

    return (
        <Stepper index={activeStep} orientation={orientation} size="lg" height={height} gap="0">
            {steps.map((step, index) => (
                <Step key={step.title}>
                    <StepIndicator>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                        />
                    </StepIndicator>

                    <MotionBox flexShrink="0">
                        <MotionStepTitle
                            initial="idle"
                            animate={activeStep === index ? 'wiggle' : 'idle'}
                            variants={animate ? variants : undefined}
                        >
                            {step.title}
                        </MotionStepTitle>
                        {step.description && (
                            <MotionStepDescription
                                initial="idle"
                                animate={activeStep === index ? 'wiggle' : 'idle'}
                                variants={variants}
                            >
                                {step.description}
                            </MotionStepDescription>
                        )}
                    </MotionBox>

                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
    );
};

export default FormStepper;
